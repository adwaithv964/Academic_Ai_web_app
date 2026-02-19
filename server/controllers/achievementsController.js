





const User = require('../models/User');
const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const { ACHIEVEMENTS } = require('../config/gamification');


const calculateStreak = async (userId) => {
    const sessions = await StudySession.find({ userId }).sort({ date: -1 });
    if (!sessions.length) return 0;

    const uniqueDates = [...new Set(sessions
        .filter(s => s.date && typeof s.date === 'string')
        .map(s => s.date.split('T')[0])
    )].sort().reverse();

    if (!uniqueDates.length) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
    }

    let streak = 1;
    let currentDate = uniqueDates[0] === today ? today : yesterday;

    
    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const expectedDate = prevDate.toISOString().split('T')[0];

        if (uniqueDates[i] === expectedDate) {
            streak++;
            currentDate = expectedDate;
        } else {
            break;
        }
    }
    return streak;
};


exports.getStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const sessions = await StudySession.find({ userId });
        let totalMinutes = 0;
        let totalEfficiency = 0;
        let efficiencyCount = 0;

        sessions.forEach(session => {
            const durationInHours = session.duration || 0;
            const durationInMinutes = durationInHours * 60;
            totalMinutes += durationInMinutes;

            if (session.plannedDuration && session.plannedDuration > 0) {
                const efficiency = (durationInMinutes / session.plannedDuration) * 100;
                totalEfficiency += efficiency;
                efficiencyCount++;
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        const formattedTime = `${hours}h ${minutes}m`;

        
        const streak = await calculateStreak(userId);

        
        const completedTasksCount = await Task.countDocuments({ userId, completed: true });

        
        const avgEfficiency = efficiencyCount > 0 ? Math.round(totalEfficiency / efficiencyCount) : 0;

        res.json({
            totalFocusTime: formattedTime,
            currentStreak: streak,
            tasksCrushed: completedTasksCount,
            averageEfficiency: avgEfficiency,
            
            rawFocusMinutes: totalMinutes,
            rawStreak: streak
        });

    } catch (err) {
        console.error("Stats Error Details:", err);
        console.error(err.stack);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};


exports.getGamification = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userId = user._id;

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.achievements) {
            user.achievements = new Map();
        }

        
        const sessions = await StudySession.find({ userId });
        let totalMinutes = 0;
        let maxSingleSession = 0;
        let powerSessions = 0;
        let earlySessions = 0;
        let nightSessions = 0;

        sessions.forEach(s => {
            const h = s.duration || 0;
            totalMinutes += (h * 60);
            if ((h * 60) > maxSingleSession) maxSingleSession = (h * 60);

            
            if (s.type === 'Focus' || s.type === 'Deep Work' || s.priority === 'High') {
                powerSessions++;
            }

            
            if (s.startTime) {
                
                const hour = parseInt(s.startTime.split(':')[0], 10);
                if (!isNaN(hour)) {
                    if (hour < 8) earlySessions++;
                    if (hour >= 22) nightSessions++;
                }
            }
        });

        const streak = await calculateStreak(userId);
        const totalHours = totalMinutes / 60;
        const totalTasks = await Task.countDocuments({ userId, completed: true });

        let badgesChanged = false;
        let xpGained = 0;

        
        ACHIEVEMENTS.forEach(ach => {
            let currentTier = 'locked';
            let currentProgress = 0;
            const existingBadge = user.achievements.get(ach.id);

            
            let metricValue = 0;
            switch (ach.id) {
                case 'marathoner':
                    metricValue = maxSingleSession; 
                    break;
                case 'centurion':
                    metricValue = totalHours; 
                    break;
                case 'streak_keeper':
                    metricValue = streak; 
                    break;
                case 'focus_master':
                    metricValue = powerSessions; 
                    break;
                case 'early_riser':
                    metricValue = earlySessions; 
                    break;
                case 'night_owl':
                    metricValue = nightSessions; 
                    break;
                case 'task_master':
                    metricValue = totalTasks; 
                    break;
                default:
                    break;
            }

            
            let bestTier = 'locked';
            let reward = 0;

            if (ach.tiers) {
                
                if (ach.tiers.gold && metricValue >= ach.tiers.gold.threshold) {
                    bestTier = 'gold';
                    reward = ach.tiers.gold.reward || 0;
                } else if (ach.tiers.silver && metricValue >= ach.tiers.silver.threshold) {
                    bestTier = 'silver';
                    reward = ach.tiers.silver.reward || 0;
                } else if (ach.tiers.bronze && metricValue >= ach.tiers.bronze.threshold) {
                    bestTier = 'bronze';
                    reward = ach.tiers.bronze.reward || 0;
                }
            } else if (ach.condition) {
                
                
            }

            
            if (bestTier !== 'locked') {
                
                if (!existingBadge || existingBadge.tier !== bestTier) {
                    
                    
                    
                    
                    

                    

                    user.achievements.set(ach.id, {
                        progress: 100, 
                        tier: bestTier,
                        unlockedAt: new Date()
                    });

                    
                    
                    

                    
                    

                    xpGained += reward;
                    badgesChanged = true;
                }
            }
        });

        if (badgesChanged) {
            user.xp = (user.xp || 0) + xpGained;
            user.totalPoints = (user.totalPoints || 0) + xpGained; 
            
            
            user.points = (user.points || 0) + xpGained;

            await user.save();
        }

        

        
        
        const constant = 0.1;
        const level = Math.floor(constant * Math.sqrt(user.xp)) + 1;

        
        if (user.level !== level) {
            user.level = level;
            await user.save();
        }

        
        
        
        
        
        
        

        const nextLevelXp = Math.pow((level) / constant, 2);

        const levelProgress = {
            currentXp: user.xp,
            nextLevelXp: Math.round(nextLevelXp),
            currentLevel: level,
            title: level >= 10 ? "Master" : (level >= 5 ? "Scholar" : "Novice")
        };

        const badgeList = ACHIEVEMENTS.map(ach => {
            const userAch = user.achievements.get(ach.id);
            return {
                ...ach,
                isUnlocked: !!userAch,
                tier: userAch ? userAch.tier : 'locked',
                unlockedAt: userAch ? userAch.unlockedAt : null
            };
        });

        res.json({
            leveling: levelProgress,
            badges: badgeList
        });

    } catch (err) {
        console.error("Gamification Error Details:", err);
        console.error(err.stack);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};
