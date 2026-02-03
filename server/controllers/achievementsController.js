const User = require('../models/User');
const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const { ACHIEVEMENTS } = require('../config/gamification');

// Helper: Calculate streak from sessions
const calculateStreak = async (userId) => {
    // Basic implementation: check consecutive days with study sessions
    // For MVP, we can just query sessions, group by date, and count consecutive days backwards from today/yesterday.
    // However, for scalability, we should rely on the User model's 'currrentStreak' and 'lastActiveDate'.
    // Here we will RE-CALCULATE it based on sessions to be robust for now.

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
            // Handle duration (assuming minutes)
            // Handle duration (stored in HOURS in DB, convert to minutes)
            const durationInHours = session.duration || 0;
            const durationInMinutes = durationInHours * 60;
            totalMinutes += durationInMinutes;

            if (session.plannedDuration && session.plannedDuration > 0) {
                // Efficiency capped at 100% for calculation? Or allow >100%? Let's cap at 100 for "Average" to be sane.
                // Actually, high efficiency is good. But >100% usually means bad estimation. 
                // Let's just do raw ratio * 100 for now.
                const efficiency = (duration / session.plannedDuration) * 100;
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
        const user = req.user;
        const userId = user._id; // Ensure we have the ID for queries
        // User is already attached by middleware, no need to find or create default here.
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.achievements) {
            user.achievements = new Map();
        }

        // --- BADGE UNLOCK CHECK ---
        // We need stats to check badges.
        // Let's re-calculate stats here or extract a helper function.
        // Helper approach is better.

        const sessions = await StudySession.find({ userId });
        let totalMinutes = 0;
        let maxSingleSession = 0;

        sessions.forEach(s => {
            const h = s.duration || 0;
            totalMinutes += (h * 60); // Convert hours to minutes
            if ((h * 60) > maxSingleSession) maxSingleSession = (h * 60);
        });

        const streak = await calculateStreak(userId);
        const totalHour = totalMinutes / 60;

        let badgesChanged = false;

        // Iterate Config Achievements
        ACHIEVEMENTS.forEach(ach => {
            // Check if already unlocked
            if (user.achievements.get(ach.id)) return;

            let unlocked = false;

            // Logic for each badge ID
            // Hardcoded logic mapping for now based on ID
            switch (ach.id) {
                case 'marathoner': // > 4 hours single session
                    if (maxSingleSession >= 240) unlocked = true; // 4 hours in minutes
                    break;
                case 'centurion': // > 100 hours total
                    if (totalHour >= 100) unlocked = true;
                    break;
                case 'streak_keeper': // > 7 days streak (bronze) - simplifying tiers for now
                    // Tiers logic: check largest threshold met
                    if (streak >= 7) unlocked = true;
                    break;
                case 'focus_master':
                    // Logic for Power Mode? Need to track "Power Mode sessions" specifically.
                    // Assuming 'type'='power' or similar in StudySession? 
                    // Or just generic "sessions count" for now.
                    // Let's skip valid check for this MVP unless we have 'power' type.
                    break;
                default:
                    break;
            }

            if (unlocked) {
                user.achievements.set(ach.id, {
                    progress: 100,
                    tier: 'bronze', // Default to bronze, implement tier logic later
                    unlockedAt: new Date()
                });
                badgesChanged = true;

                // Award XP?
                // user.xp += 100;
            }
        });

        if (badgesChanged) {
            await user.save();
        }

        // --- RESPONSE CONSTRUCTION ---

        // Level Calc
        const constant = 0.1;
        const level = Math.floor(constant * Math.sqrt(user.xp)) + 1;

        // XP for next level: L = k * sqrt(XP) => XP = (L/k)^2
        // Next Level = Level + 1
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
