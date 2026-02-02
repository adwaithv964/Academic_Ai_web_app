import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LevelingSystem = ({ leveling }) => {
    const { currentXp, nextLevelXp, currentLevel, title } = leveling;

    // Calculate percentage relative to current level band
    // To make bar specifically shows progress between levels:
    // We need prevLevelXp. For now let's just do Raw % of NextLevel (simple) 
    // or logic: (current - prevBase) / (next - prevBase)
    // Re-using logic from backend for base:
    const prevLevelBaseXp = Math.pow(((currentLevel - 1) / 0.1), 2);
    const bandTotal = nextLevelXp - prevLevelBaseXp;
    const progressInBand = currentXp - prevLevelBaseXp;
    const percent = Math.min(Math.max((progressInBand / bandTotal) * 100, 0), 100);

    return (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-32 h-32 text-white" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wider mb-1">Current Rank</h3>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                            {title} <span className="text-lg text-purple-400 font-mono">Lvl {currentLevel}</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white">{Math.floor(currentXp)} <span className="text-sm text-purple-300 font-normal">XP</span></p>
                        <p className="text-xs text-gray-400">Next Level: {nextLevelXp} XP</p>
                    </div>
                </div>

                <div className="relative h-4 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                    {Math.floor(nextLevelXp - currentXp)} XP needed to reach Level {currentLevel + 1}
                </p>
            </div>
        </div>
    );
};

export default LevelingSystem;
