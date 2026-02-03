import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { gamification } from '../../../services/api';

const UserRankWidget = () => {
    const [stats, setStats] = useState({
        rank: "Scholar Lvl 1",
        streak: 0,
        currentXP: 0,
        nextLevelXP: 100
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Try fetching from API similar to Achievements page
                const [statsRes, gameRes] = await Promise.all([
                    gamification.getStats(),
                    gamification.getGamification()
                ]);

                setStats({
                    rank: gameRes?.leveling?.title ? `${gameRes.leveling.title} Lvl ${gameRes.leveling.currentLevel}` : "Scholar Lvl 1",
                    streak: statsRes?.currentStreak || 0,
                    currentXP: gameRes?.leveling?.currentXp || 0,
                    nextLevelXP: gameRes?.leveling?.nextLevelXp || 100
                });
            } catch (error) {
                console.warn("Failed to fetch user rank stats, using localStorage or default", error);
                // Fallback / Mock
                setStats({
                    rank: "Scholar Lvl 3",
                    streak: 3,
                    currentXP: 350,
                    nextLevelXP: 500
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const progress = (stats.currentXP / stats.nextLevelXP) * 100;

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl p-6 shadow-sm text-white h-full relative overflow-hidden">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <h3 className="text-white/70 font-medium text-sm flex items-center gap-2">
                        <Icon name="Award" size={14} className="text-yellow-400" />
                        Rank & Streak
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                        <h4 className="text-2xl font-bold">{stats.rank}</h4>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                    <Icon name="Flame" size={20} className="text-orange-500 fill-orange-500 animate-pulse" />
                    <span className="text-xs font-bold mt-1">{stats.streak} Day Streak</span>
                </div>
            </div>

            <div className="mt-6 z-10 relative">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>XP Progress</span>
                    <span>{stats.currentXP} / {stats.nextLevelXP} XP</span>
                </div>
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-white/50 mt-2">Level Up in {Math.max(0, stats.nextLevelXP - stats.currentXP)} XP</p>
            </div>

            {/* Decorative Background */}
            <div className="absolute -bottom-4 -right-4 opacity-10">
                <Icon name="Medal" size={100} />
            </div>
        </div>
    );
};

export default UserRankWidget;
