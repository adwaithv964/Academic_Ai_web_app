import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import api from '../../../services/api';

const DailyQuests = ({ user, onClaim }) => {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(null);

    useEffect(() => {
        if (user?._id) {
            api.gamification.getQuests(user._id)
                .then(data => setQuests(data.daily))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            console.warn("DailyQuests: No user ID found");
            setLoading(false);
        }
    }, [user]);

    const handleClaim = async (quest) => {
        setClaiming(quest.id);
        try {
            const res = await api.gamification.claimQuest(user._id, quest.id);
            if (res.success) {
                onClaim(res.points);
                // Update local state to show as claimed
                setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, claimed: true, completed: true } : q));
            }
        } catch (err) {
            console.error("Claim failed", err);
        } finally {
            setClaiming(null);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-400">Loading Quests...</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Icon name="Target" className="text-red-500" />
                Today's Quests
            </h3>
            <div className="space-y-4">
                {quests.map(quest => (
                    <div key={quest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <Icon name="Crosshair" size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{quest.text}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        +{quest.reward} pts
                                    </span>
                                    <span className="text-xs text-gray-400">Daily Goal</span>
                                </div>
                            </div>
                        </div>

                        {quest.claimed ? (
                            <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-green-600 border border-transparent flex items-center gap-1">
                                <Icon name="Check" size={16} /> Claimed
                            </button>
                        ) : (
                            <button
                                onClick={() => handleClaim(quest)}
                                disabled={claiming === quest.id}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                            >
                                {claiming === quest.id ? 'Claiming...' : 'Claim Reward'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyQuests;
