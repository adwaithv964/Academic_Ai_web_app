const User = require('../models/User');
const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const { ACHIEVEMENTS } = require('../config/gamification');

// Helper: Calculate streak from sessions
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

    // If no session today or yesterday, streak is broken (0)
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
    }

    let streak = 1;
    let currentDate = uniqueDates[0] === today ? today : yesterday;

    // Check backwards
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

// GET /api/achievements/stats
exports.getStats = async (req, res) => {
    try {
        const userId = req.user._id;
        // 1. Total Focus Time
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

        // 2. Current Streak
        const streak = await calculateStreak(userId);

        // 3. Tasks Crushed
        const completedTasksCount = await Task.countDocuments({ userId, completed: true });

        // 4. Average Efficiency
        const avgEfficiency = efficiencyCount > 0 ? Math.round(totalEfficiency / efficiencyCount) : 0;

        res.json({
            totalFocusTime: formattedTime,
            currentStreak: streak,
            tasksCrushed: completedTasksCount,
            averageEfficiency: avgEfficiency,
            // Raw values for badge checking
            rawFocusMinutes: totalMinutes,
            rawStreak: streak
        });

    } catch (err) {
        console.error("Stats Error Details:", err);
        console.error(err.stack);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

// GET /api/achievements
exports.getGamification = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userId = user._id;

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.achievements) {
            user.achievements = new Map();
        }

        // --- BADGE UNLOCK CHECK ---
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

            // Power Mode Check
            if (s.type === 'Focus' || s.type === 'Deep Work' || s.priority === 'High') {
                powerSessions++;
            }

            // Time Check (Early/Night)
            if (s.startTime) {
                // startTime is "HH:MM" string
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

        // Iterate Config Achievements
        ACHIEVEMENTS.forEach(ach => {
            let currentTier = 'locked';
            let currentProgress = 0;
            const existingBadge = user.achievements.get(ach.id);

            // Determine Metric
            let metricValue = 0;
            switch (ach.id) {
                case 'marathoner':
                    metricValue = maxSingleSession; // max minutes
                    break;
                case 'centurion':
                    metricValue = totalHours; // total hours
                    break;
                case 'streak_keeper':
                    metricValue = streak; // streak days
                    break;
                case 'focus_master':
                    metricValue = powerSessions; // count
                    break;
                case 'early_riser':
                    metricValue = earlySessions; // count
                    break;
                case 'night_owl':
                    metricValue = nightSessions; // count
                    break;
                case 'task_master':
                    metricValue = totalTasks; // count
                    break;
                default:
                    break;
            }

            // Check Tiers
            let bestTier = 'locked';
            let reward = 0;

            if (ach.tiers) {
                // Check Gold first, then Silver, then Bronze
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
                // Fallback for simple boolean badges if tiers missing
                // (Existing logic support)
            }

            // Update Logic
            if (bestTier !== 'locked') {
                // If new badge or upgrade
                if (!existingBadge || existingBadge.tier !== bestTier) {
                    // Calculate incremental XP if upgrading (optional, or just give full reward if distinct)
                    // For simplicity, we give the reward of the reached tier. 
                    // To avoid double dipping, we should ideally store 'rewardsClaimed' but let's just give the difference or full for now.
                    // Let's give the FULL reward of the new tier, but maybe we should subtract previous? 
                    // Gamification usually motivates by giving more. Let's just give the reward defined for that tier.

                    // Logic: If upgrading Bronze -> Silver, give Silver reward.

                    user.achievements.set(ach.id, {
                        progress: 100, // Or actual % calculation
                        tier: bestTier,
                        unlockedAt: new Date()
                    });

                    // Award XP
                    // Only award if it's an UPGRADE or NEW
                    // Prevent re-awarding same tier (handled by existingBadge.tier !== bestTier)

                    // NOTE: If user jumps straight to Gold, they get Gold reward. 
                    // They might miss Bronze/Silver rewards. acceptable for MVP.

                    xpGained += reward;
                    badgesChanged = true;
                }
            }
        });

        if (badgesChanged) {
            user.xp = (user.xp || 0) + xpGained;
            user.totalPoints = (user.totalPoints || 0) + xpGained; // Keep points in sync if XP == Points
            // Note: User model has 'points' and 'xp'. Let's update both for consistency, or just XP.
            // Model says: xp: { type: Number, default: 0 }, points: { type: Number, default: 0 }
            user.points = (user.points || 0) + xpGained;

            await user.save();
        }

        // --- RESPONSE CONSTRUCTION ---

        // Level Calc
        // Formula: Level = k * sqrt(XP)
        const constant = 0.1;
        const level = Math.floor(constant * Math.sqrt(user.xp)) + 1;

        // Save level if changed
        if (user.level !== level) {
            user.level = level;
            await user.save();
        }

        // XP for next level
        // Next Level = Level + 1
        // Required XP = ((Level)/k)^2  <-- Wait, if L = k*sqrt(XP) -> XP = (L/k)^2. 
        // So for level L+1, we need (L+1/k)^2? 
        // Current Level L starts at (L-1/k)^2. 
        // Let's stick to the formula: required for *current* level was (Level-1 / k)^2?
        // Let's just use: Next Level Threshold = (CurrentLevel / k)^2  (to reach next)

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
