import React from 'react';
import Icon from '../../../components/AppIcon';

const StudyGarden = ({ user }) => {
    // Determine garden level/state based on user data
    // This is a visual representation
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
                        Total Hours: {Math.floor((user.totalPoints || 0) / 100)}h
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 h-64 items-end justify-items-center">
                    {/* Visual representation of plants - placeholder for now */}
                    <div className="flex flex-col items-center">
                        <Icon name="Flower2" size={48} className="text-pink-500 animate-bounce cursor-pointer hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-green-800 mt-2 bg-white/60 px-2 py-0.5 rounded-full">Rose</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Icon name="Trees" size={64} className="text-green-600 hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-green-800 mt-2 bg-white/60 px-2 py-0.5 rounded-full">Oak</span>
                    </div>
                    <div className="flex flex-col items-center opacity-50 grayscale">
                        <Icon name="Sprout" size={32} className="text-green-500" />
                        <span className="text-xs font-bold text-green-800 mt-2">Locked</span>
                    </div>
                    <div className="flex flex-col items-center opacity-50 grayscale">
                        <Icon name="Sprout" size={32} className="text-green-500" />
                        <span className="text-xs font-bold text-green-800 mt-2">Locked</span>
                    </div>
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
