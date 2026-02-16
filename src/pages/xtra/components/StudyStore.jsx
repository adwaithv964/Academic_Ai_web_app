import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import api from '../../../services/api';
import { useTheme } from '../../../contexts/ThemeContext';

const StudyStore = ({ user, onPurchase }) => {
    const { theme, updateTheme } = useTheme();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(null);
    const [equipping, setEquipping] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.gamification.getStoreItems()
            .then(data => setItems(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleBuy = async (item) => {
        // For challenges, price is 0, so this check passes if price is 0.
        if (item.price > 0 && user.points < item.price) return;

        setBuying(item.id);
        setError(null);
        try {
            const res = await api.gamification.buyItem(item.id);
            if (res.success) {
                // If it was a challenge, res.points includes the reward!
                onPurchase(res.points, res.inventory);
            }
        } catch (err) {
            console.error("Claim failed", err);
            // Show error to user (e.g., "Condition Not Met")
            const msg = err.response?.data?.error || "Failed to claim.";
            setError({ itemId: item.id, msg });
            setTimeout(() => setError(null), 3000);
        } finally {
            setBuying(null);
        }
    };

    const handleEquip = async (item) => {
        if (item.type !== 'theme') return;
        setEquipping(item.id);
        try {
            await updateTheme(item.id);
        } catch (err) {
            console.error("Equip failed", err);
        } finally {
            setEquipping(null);
        }
    };

    // Helper to check if condition is met (Frontend approximation)
    const checkUnlockCondition = (condition) => {
        if (!condition) return true;
        const { type, threshold } = condition;

        switch (type) {
            case 'level':
                return (user.level || 1) >= threshold;
            case 'streak':
                // Simple streak check
                return (user.streak || 0) >= threshold;
            // For complex backend checks, we return TRUE here to let the user TRY to claim.
            // The backend will reject if not met.
            case 'time_window':
            case 'task_type_count':
            case 'weekend_study':
            case 'strict_streak':
                return true;
            default:
                return true;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Challenges...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => {
                    const isOwned = item.id === 'default' || user.inventory?.includes(item.id);
                    const canAfford = user.points >= item.price;
                    const isActive = (theme || 'default') === item.id;
                    const isTheme = item.type === 'theme';
                    const isChallenge = item.type === 'challenge';

                    // Check if condition is met (visually)
                    const isConditionMet = checkUnlockCondition(item.unlockCondition);
                    const isLocked = !isConditionMet && !isChallenge; // Only lock non-challenges strictly

                    return (
                        <div key={item.id} className={`bg-white border text-card-foreground shadow-sm rounded-xl p-6 flex flex-col justify-between transition-all hover:shadow-md relative ring-1 ${isOwned ? 'ring-green-100' : 'ring-gray-100'}`}>
                            {/* Error Toast specific to item */}
                            {error && error.itemId === item.id && (
                                <div className="absolute inset-0 bg-red-50/95 flex items-center justify-center p-4 text-center text-red-600 font-bold rounded-xl z-10 animate-in fade-in">
                                    {error.msg}
                                </div>
                            )}

                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${isOwned ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <Icon name={isChallenge ? 'Award' : 'Zap'} size={24} />
                                    </div>
                                    {!isOwned && item.reward && (
                                        <div className="text-right">
                                            <span className="block text-xs text-gray-400 uppercase font-bold">Reward</span>
                                            <span className="font-bold text-lg text-indigo-600">+{item.reward} pts</span>
                                        </div>
                                    )}
                                    {isOwned && <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Completed</span>}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                                <p className="text-gray-500 text-sm mb-2">{item.description}</p>

                                {item.unlockCondition && !isOwned && (
                                    <div className="mb-4 bg-slate-50 text-slate-700 text-xs p-2 rounded border border-slate-100 flex items-center gap-2">
                                        <Icon name="AlertCircle" size={12} />
                                        <span>Rule: {item.unlockCondition.description}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                {!isOwned ? (
                                    <button
                                        onClick={() => handleBuy(item)}
                                        disabled={(!canAfford && item.price > 0) || buying === item.id || isLocked}
                                        className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                                            ${(!canAfford && item.price > 0) || isLocked
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform active:scale-95'
                                            }`}
                                    >
                                        {buying === item.id ? (
                                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <>
                                                <Icon name="CheckCircle" size={18} /> {isChallenge ? "Verify & Claim" : "Buy"}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button disabled className="w-full py-2.5 rounded-lg font-medium bg-green-50 text-green-600 cursor-default border border-green-100 flex items-center justify-center gap-2">
                                        <Icon name="Check" size={16} /> Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudyStore;
