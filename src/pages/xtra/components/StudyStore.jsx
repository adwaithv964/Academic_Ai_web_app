import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import api from '../../../services/api';

const StudyStore = ({ user, onPurchase }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(null);

    useEffect(() => {
        api.gamification.getStoreItems()
            .then(data => setItems(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleBuy = async (item) => {
        if (user.points < item.price) return;
        setBuying(item.id);
        try {
            const res = await api.gamification.buyItem(user._id, item.id);
            if (res.success) {
                onPurchase(res.points, res.inventory);
            }
        } catch (err) {
            console.error("Purchase failed", err);
            // Optionally show error toast
        } finally {
            setBuying(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Store...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => {
                    const isOwned = user.inventory?.includes(item.id);
                    const canAfford = user.points >= item.price;

                    return (
                        <div key={item.id} className="bg-white border text-card-foreground shadow-sm rounded-xl p-6 flex flex-col justify-between transition-all hover:shadow-md">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${isOwned ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <Icon name={item.type === 'theme' ? 'Palette' : item.type === 'avatar' ? 'User' : 'Zap'} size={24} />
                                    </div>
                                    <span className="font-bold text-lg">{item.price} pts</span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                            </div>

                            <button
                                onClick={() => handleBuy(item)}
                                disabled={isOwned || !canAfford || buying === item.id}
                                className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                                    ${isOwned
                                        ? 'bg-gray-100 text-green-600 cursor-default'
                                        : canAfford
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform active:scale-95'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {buying === item.id ? (
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                ) : isOwned ? (
                                    <>
                                        <Icon name="Check" size={18} /> Owned
                                    </>
                                ) : (
                                    'Redeem'
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudyStore;
