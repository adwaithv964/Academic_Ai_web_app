
// Store Items: Challenge Contracts
const STORE_ITEMS = [
    {
        id: 'challenge_night_owl',
        name: 'The Night Owl',
        type: 'challenge',
        price: 0, // Costs nothing to accept/view
        reward: 3000,
        description: 'Complete a study session between 2 AM and 5 AM.',
        unlockCondition: { type: 'time_window', startHour: 2, endHour: 5, description: 'Study between 2 AM - 5 AM' }
    },
    {
        id: 'challenge_task_master',
        name: 'Task Master',
        type: 'challenge',
        price: 0,
        reward: 10000,
        description: 'Complete 50 Tasks.',
        unlockCondition: { type: 'task_count', threshold: 50, description: 'Complete 50 Tasks' }
    },
    {
        id: 'challenge_weekend_warrior',
        name: 'Weekend Warrior',
        type: 'challenge',
        price: 0,
        reward: 5000,
        description: 'Study for 10 hours on a Saturday or Sunday.',
        unlockCondition: { type: 'weekend_study', threshold: 600, description: '10 Hours on Sat/Sun' }
    },
    {
        id: 'challenge_perfect_week',
        name: 'The Perfect Week',
        type: 'challenge',
        price: 0,
        reward: 7000,
        description: 'Maintain a 7-day streak with >1 hour study each day.',
        unlockCondition: { type: 'strict_streak', days: 7, minMinutes: 60, description: '7 Days Streak (>1hr/day)' }
    }
];

// Achievements
const ACHIEVEMENTS = [
    {
        id: 'marathoner',
        title: 'Marathoner',
        description: 'Studied for 4 hours in a single day.',
        icon: 'runner_icon',
        tiers: {
            bronze: { threshold: 1, reward: 200 } // 1x 4 hour session? Usually boolean or count. Let's say count of days
        },
        condition: 'single_session_duration_minutes >= 240'
    },
    {
        id: 'centurion',
        title: 'Centurion',
        description: 'Reach 100 total hours of study.',
        icon: 'shield_icon',
        tiers: {
            gold: { threshold: 100, reward: 5000 }
        },
        condition: 'total_study_hours >= 100'
    },
    {
        id: 'focus_master',
        title: 'Focus Master',
        description: 'Complete Power Mode sessions.',
        tiers: {
            bronze: { threshold: 10, reward: 0 },
            silver: { threshold: 50, reward: 500 },
            gold: { threshold: 100, reward: 1000 }
        }
    },
    {
        id: 'streak_keeper',
        title: 'Streak Keeper',
        description: 'Maintain a daily study streak.',
        tiers: {
            bronze: { threshold: 7, reward: 100 },
            silver: { threshold: 30, reward: 500 },
            gold: { threshold: 100, reward: 2000 }
        }
    },
    {
        id: 'early_riser',
        title: 'Early Riser',
        description: 'Complete a study session before 8 AM.',
        icon: 'sun_icon',
        tiers: {
            bronze: { threshold: 1, reward: 100 },
            silver: { threshold: 10, reward: 500 },
            gold: { threshold: 50, reward: 2000 }
        }
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Complete a study session after 10 PM.',
        icon: 'moon_icon',
        tiers: {
            bronze: { threshold: 1, reward: 100 },
            silver: { threshold: 10, reward: 500 },
            gold: { threshold: 50, reward: 2000 }
        }
    },
    {
        id: 'task_master',
        title: 'Task Master',
        description: 'Complete tasks to stay on top.',
        icon: 'target_icon',
        tiers: {
            bronze: { threshold: 10, reward: 100 },
            silver: { threshold: 50, reward: 500 },
            gold: { threshold: 100, reward: 1000 }
        }
    }
];

// Quests
const DAILY_QUESTS_POOL = [
    { id: 'daily_tasks_3', text: 'Complete 3 tasks', target: 3, reward: 50, type: 'tasks_completed' },
    { id: 'daily_study_45', text: 'Study for 45 minutes', target: 45, reward: 75, type: 'study_minutes' },
    { id: 'daily_login', text: 'Log in today', target: 1, reward: 10, type: 'login' },
    // New Quests
    { id: 'daily_exam_1', text: 'Ace the Test: Complete 1 Exam/Quiz', target: 1, reward: 100, type: 'exam_completed' },
    { id: 'daily_study_120', text: 'Deep Work: Study for 2 hours', target: 120, reward: 150, type: 'study_minutes' }, // type matches existing logic if possible, or new
    { id: 'daily_tasks_5', text: 'Task Force: Complete 5 Tasks', target: 5, reward: 100, type: 'tasks_completed' },
    { id: 'daily_focus_1', text: 'Laser Focus: Complete 1 Focus Session', target: 1, reward: 50, type: 'focus_session' }
];

module.exports = {
    STORE_ITEMS,
    ACHIEVEMENTS,
    DAILY_QUESTS_POOL
};
