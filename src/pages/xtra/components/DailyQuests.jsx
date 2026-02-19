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
            const res = await api.gamification.claimQuest(quest.id);
            if (res.success) {
                onClaim(res.points);
                
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
                        ) : (quest.completed || (quest.progress >= quest.target)) ? (
                            <button
                                onClick={() => handleClaim(quest)}
                                disabled={claiming === quest.id}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center gap-2 transform active:scale-95"
                            >
                                {claiming === quest.id ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Icon name="Gift" size={16} /> Claim
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-semibold text-gray-500">
                                    {quest.progress} / {quest.target}
                                </span>
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyQuests;
