import React, { useState, useEffect } from 'react';
import { gamification as gamificationApi } from 'services/api';
import { useAuth } from 'contexts/AuthContext';
import HeroStats from 'components/achievements/HeroStats';
import BadgeGrid from 'components/achievements/BadgeGrid';
import LevelingSystem from 'components/achievements/LevelingSystem';
import CourseAchievements from 'components/achievements/CourseAchievements';
import HistoryOfGlory from 'components/achievements/HistoryOfGlory';

const Achievements = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalFocusTime: '0h 0m',
        currentStreak: 0,
        tasksCrushed: 0,
        averageEfficiency: 0
    });

    const [gamification, setGamification] = useState({
        leveling: {
            currentXp: 0,
            nextLevelXp: 100,
            currentLevel: 1,
            title: 'Novice'
        },
        badges: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, gameRes] = await Promise.all([
                    gamificationApi.getStats(),
                    gamificationApi.getGamification()
                ]);

                setStats(statsRes);
                setGamification(gameRes);
            } catch (error) {
                console.error("Failed to fetch achievements data. Using Demo Data.", error);

                // Fallback Demo Data for UI Resilience
                setStats({
                    totalFocusTime: '12h 30m',
                    currentStreak: 3,
                    tasksCrushed: 15,
                    averageEfficiency: 85
                });

                setGamification({
                    leveling: {
                        currentXp: 350,
                        nextLevelXp: 500,
                        currentLevel: 3,
                        title: 'Scholar'
                    },
                    badges: [
                        {
                            id: 'marathoner',
                            title: 'Marathoner',
                            description: 'Studied for 4 hours in a single day.',
                            icon: 'runner_icon',
                            isUnlocked: true,
                            unlockedAt: new Date()
                        },
                        {
                            id: 'streak_keeper',
                            title: 'Streak Keeper',
                            description: 'Maintain a daily study streak.',
                            icon: 'shield_icon',
                            isUnlocked: false
                        },
                        {
                            id: 'centurion',
                            title: 'Centurion',
                            description: 'Reach 100 total hours of study.',
                            icon: 'shield_icon',
                            isUnlocked: false
                        },
                        {
                            id: 'focus_master',
                            title: 'Focus Master',
                            description: 'Complete Power Mode sessions.',
                            icon: 'medal_icon',
                            isUnlocked: false
                        }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-6 md:p-8 text-gray-100 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
                    <p className="text-gray-400">Track your progress, unlock badges, and level up your academic journey.</p>
                </header>

                {/* 1. Hero Stats Section */}
                <HeroStats stats={stats} />

                {/* Main Content Area (Split View) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (66% width) */}
                    <div className="lg:col-span-2 space-y-8">
                        <BadgeGrid badges={gamification.badges} />
                        <CourseAchievements />
                    </div>

                    {/* Right Column (33% width) */}
                    <div className="lg:col-span-1 space-y-8">
                        <LevelingSystem leveling={gamification.leveling} />
                        <HistoryOfGlory />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Achievements;
