import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import api from '../../../services/api';

import { ACHIEVEMENTS_LIST, LEVEL_THRESHOLDS } from '../constants';

// Sub-components
import StudyStore from './StudyStore';
import DailyQuests from './DailyQuests';
import Leaderboard from './Leaderboard';
import StudyGarden from './StudyGarden';

const Rewards = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = () => {
        api.user.get()
            .then(data => {
                // Initialize defaults if missing (for legacy users)
                if (!data.points) data.points = 0;
                if (!data.inventory) data.inventory = [];
                if (!data.achievements) data.achievements = {};
                setUser(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleTransaction = (newPoints, newInventory) => {
        setUser(prev => ({ ...prev, points: newPoints, inventory: newInventory }));
    };

    const handleClaim = (newPoints) => {
        setUser(prev => ({ ...prev, points: prev.points + newPoints, totalPoints: (prev.totalPoints || 0) + newPoints }));
    };

    if (loading || !user) {
        return <div className="p-8 flex items-center justify-center h-full"><span className="animate-spin text-indigo-600"><Icon name="Loader" size={32} /></span></div>;
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
        { id: 'store', label: 'Store', icon: 'ShoppingBag' },
        { id: 'quests', label: 'Quests', icon: 'Target' },
        { id: 'garden', label: 'Garden', icon: 'Flower2' },
        { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy' },
    ];

    // Calculated derived state
    const currentLevel = LEVEL_THRESHOLDS.slice().reverse().find(l => (user.totalPoints || 0) >= l.points) || LEVEL_THRESHOLDS[0];
    const nextLevel = LEVEL_THRESHOLDS.find(l => l.points > (user.totalPoints || 0));
    const progressToNext = nextLevel
        ? ((user.totalPoints - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100
        : 100;

    // Process Achievements with User Data
    const achievementsStatus = ACHIEVEMENTS_LIST.map(base => {
        const userState = user.achievements?.[base.id] || { progress: 0, tier: 'locked' };
        // Simple logic: if tier is not locked, it's completed (for binary view), 
        // OR check if progress > bronze threshold
        const isUnlocked = userState.tier !== 'locked' || userState.progress >= base.tiers.bronze.threshold;

        return {
            ...base,
            progress: userState.progress,
            currentTier: userState.tier,
            completed: isUnlocked, // For the summary view
            nextThreshold: base.tiers.bronze.threshold // Simplified for summary
        };
    });

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
            {/* Header Area */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Rewards & Progress</h1>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <p className="text-purple-100 font-medium mb-1">Total Points</p>
                        <h2 className="text-5xl font-bold mb-4">{user.points?.toLocaleString()}</h2>
                        <div className="flex gap-3">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10">
                                {currentLevel.label}
                            </span>
                            <span className="bg-yellow-400/30 text-yellow-100 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-yellow-400/20 flex items-center gap-1">
                                <Icon name="Flame" size={14} /> {user.streak || 0} Day Streak
                            </span>
                        </div>
                    </div>

                    {/* Active Quest Preview */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-full md:w-64 border border-white/10">
                        <h4 className="text-sm font-semibold text-purple-100 mb-2">Next Reward: {nextLevel ? nextLevel.label : 'Max Level'}</h4>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${progressToNext}%` }} />
                        </div>
                        <p className="text-xs text-right text-purple-200">
                            {user.totalPoints} / {nextLevel ? nextLevel.points : user.totalPoints} pts
                        </p>
                    </div>
                </div>

                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Icon name="Award" size={250} />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-full font-medium whitespace-nowrap flex items-center gap-2 transition-all
                            ${activeTab === tab.id
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <Icon name={tab.icon} size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Highlights Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DailyQuests user={user} onClaim={handleClaim} />

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
                                <div className="space-y-4">
                                    {achievementsStatus.slice(0, 3).map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                                                <Icon name={item.icon} size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>{item.title}</h4>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                                {/* Progress Bar for Incomplete */}
                                                {!item.completed && (
                                                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full"
                                                            style={{ width: `${Math.min(100, (item.progress / item.nextThreshold) * 100)}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {item.completed && (
                                                <div className="bg-green-100 text-green-700 p-1 rounded-full">
                                                    <Icon name="Check" size={14} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={() => setActiveTab('leaderboard')} className="w-full mt-2 py-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50 rounded-lg transition-colors">
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Garden Teaser */}
                        <div onClick={() => setActiveTab('garden')} className="cursor-pointer transition-transform hover:scale-[1.01]">
                            <StudyGarden user={user} />
                        </div>
                    </div>
                )}

                {activeTab === 'store' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <StudyStore user={user} onPurchase={handleTransaction} />
                    </div>
                )}

                {activeTab === 'quests' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h2 className="text-xl font-bold mb-4">Active Challenges</h2>
                        <DailyQuests user={user} onClaim={handleClaim} />
                    </div>
                )}

                {activeTab === 'garden' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <StudyGarden user={user} />
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <Leaderboard />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rewards;
