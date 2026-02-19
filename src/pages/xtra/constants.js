export const ACHIEVEMENTS_LIST = [
    {
        id: 'focus_master',
        title: 'Focus Master',
        description: 'Complete Power Mode sessions',
        icon: 'Zap',
        color: 'text-purple-500',
        bg: 'bg-purple-100',
        tiers: {
            bronze: { threshold: 10, label: 'Bronze' },
            silver: { threshold: 50, label: 'Silver' },
            gold: { threshold: 100, label: 'Gold' }
        }
    },
    {
        id: 'streak_keeper',
        title: 'Streak Keeper',
        description: 'Maintain a daily study streak',
        icon: 'Flame',
        color: 'text-orange-500',
        bg: 'bg-orange-100',
        tiers: {
            bronze: { threshold: 7, label: '7 Days' },
            silver: { threshold: 30, label: '30 Days' },
            gold: { threshold: 100, label: '100 Days' }
        }
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete a session before 8 AM',
        icon: 'Sun',
        color: 'text-amber-500',
        bg: 'bg-amber-100',
        tiers: {
            bronze: { threshold: 1, label: 'First Time' },
            silver: { threshold: 10, label: '10 Times' },
            gold: { threshold: 50, label: '50 Times' }
        }
    }
];

export const LEVEL_THRESHOLDS = [
    { points: 0, label: 'Novice' },
    { points: 1000, label: 'Scholar (Lvl 1)' },
    { points: 5000, label: 'Scholar (Lvl 2)' },
    { points: 10000, label: 'Grandmaster' }
];
