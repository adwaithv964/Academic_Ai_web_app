import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import api from '../../../services/api';

const StudyGarden = ({ user }) => {
    const [gardenData, setGardenData] = useState({ totalHours: 0, plants: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGarden = async () => {
            try {
                const data = await api.gamification.getGarden();
                setGardenData(data);
            } catch (err) {
                console.error("Failed to load garden:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGarden();
    }, []);

    // Fallback if API fails or loading (use props if available or zeros)
    const displayHours = loading ? (user?.totalPoints ? (user.totalPoints / 100).toFixed(1) : "0.0") : gardenData.totalHours;

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 relative overflow-hidden border border-green-100">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-green-900">My Study Garden</h3>
                        <p className="text-green-700">Every hour of study grows your garden.</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-green-800 font-bold flex items-center gap-2">
                        <Icon name="Clock" size={18} />
                        Total Hours: {displayHours}h
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 h-64 items-end justify-items-center">
                    {loading ? (
                        <div className="col-span-4 text-green-600 animate-pulse">Loading Garden...</div>
                    ) : (
                        gardenData.plants.map((plant, index) => (
                            <div key={plant.id} className={`flex flex-col items-center ${!plant.unlocked ? 'opacity-50 grayscale' : ''}`}>
                                <Icon
                                    name={plant.icon}
                                    size={plant.id === 'oak' ? 64 : 48} // Example sizing
                                    className={`${plant.color} ${plant.unlocked ? 'hover:scale-110 transition-transform cursor-pointer' : ''}`}
                                />
                                <span className={`text-xs font-bold text-green-800 mt-2 ${plant.unlocked ? 'bg-white/60 px-2 py-0.5 rounded-full' : ''}`}>
                                    {plant.unlocked ? plant.name : 'Locked'}
                                </span>
                                {!plant.unlocked && (
                                    <span className="text-[10px] text-green-600 mt-1">Need {plant.unlockHours}h</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-green-200/50 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <Icon name="Sun" size={120} className="text-yellow-500" />
            </div>
        </div>
    );
};

export default StudyGarden;
