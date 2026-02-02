
// Store Items
const STORE_ITEMS = [
    { id: 'theme_dark', name: 'Dark Mode', type: 'theme', price: 500, description: 'Unlock the sleek Dark Mode theme.' },
    { id: 'theme_cyberpunk', name: 'Cyberpunk Theme', type: 'theme', price: 500, description: 'Neon vibes for your study sessions.' },
    { id: 'theme_nature', name: 'Nature Theme', type: 'theme', price: 500, description: 'Relaxing green tones.' },
    { id: 'avatar_gold', name: 'Golden Avatar', type: 'avatar', price: 1000, description: 'Shine bright with a golden profile picture.' },
    { id: 'title_grandmaster', name: 'Grandmaster Title', type: 'title', price: 1500, description: 'Show off your mastery.' },
    { id: 'item_freeze', name: 'Streak Freeze', type: 'consumable', price: 200, description: 'Protect your streak for one day.' }
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
    }
];

// Quests
const DAILY_QUESTS_POOL = [
    { id: 'daily_tasks_3', text: 'Complete 3 tasks', target: 3, reward: 50, type: 'tasks_completed' },
    { id: 'daily_study_45', text: 'Study for 45 minutes', target: 45, reward: 75, type: 'study_minutes' },
    { id: 'daily_login', text: 'Log in today', target: 1, reward: 10, type: 'login' }
];

module.exports = {
    STORE_ITEMS,
    ACHIEVEMENTS,
    DAILY_QUESTS_POOL
};
