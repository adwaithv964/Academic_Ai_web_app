import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { tasks as tasksApi, sessions as sessionsApi } from '../../../services/api';

const StreaksHeatmap = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalHours: 0,
        completionRate: 0,
        heatmapData: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksData, sessionsData] = await Promise.all([
                tasksApi.list(),
                sessionsApi.list()
            ]);

            processStats(tasksData || [], sessionsData || []);
        } catch (error) {
            console.error('Failed to fetch streak data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (tasks, sessions) => {
        
        const activityMap = new Map();

        
        sessions.forEach(session => {
            if (!session.date) return;
            const dateStr = new Date(session.date).toDateString();
            const current = activityMap.get(dateStr) || 0;
            
            activityMap.set(dateStr, current + (session.duration || 1));
        });

        
        
        tasks.forEach(task => {
            if (!task.createdAt) return;
            const dateStr = new Date(task.createdAt).toDateString();
            const current = activityMap.get(dateStr) || 0;
            activityMap.set(dateStr, current + 0.5);
        });

        
        const heatmapData = [];
        const today = new Date();
        const dates = []; 

        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toDateString();
            const score = activityMap.get(dateStr) || 0;

            
            let intensity = 0;
            if (score > 0) intensity = 1;
            if (score >= 1) intensity = 2;
            if (score >= 3) intensity = 3;
            if (score >= 5) intensity = 4;

            heatmapData.push({ date: d, intensity });

            if (score > 0) {
                dates.push(d.setHours(0, 0, 0, 0));
            }
        }

        
        
        const uniqueDates = [...new Set(dates)].sort((a, b) => a - b);

        
        let currentStreak = 0;
        const todayTime = new Date(today).setHours(0, 0, 0, 0);
        const yesterdayObj = new Date(today);
        yesterdayObj.setDate(today.getDate() - 1);
        const yesterdayTime = yesterdayObj.setHours(0, 0, 0, 0);

        
        const lastActive = uniqueDates[uniqueDates.length - 1];
        if (lastActive === todayTime || lastActive === yesterdayTime) {
            let streak = 0;
            let checkDate = lastActive;

            
            for (let i = uniqueDates.length - 1; i >= 0; i--) {
                const d = uniqueDates[i];
                
                const diff = (checkDate - d) / (1000 * 60 * 60 * 24);

                if (diff <= 1) { 
                    if (diff === 1) streak++; 
                    if (diff === 0 && i === uniqueDates.length - 1) streak = 1; 
                    checkDate = d;
                } else {
                    break;
                }
            }
            currentStreak = streak;
        }

        
        let longestStreak = 0;
        let tempStreak = 0;
        let prevDate = null;

        uniqueDates.forEach(d => {
            if (!prevDate) {
                tempStreak = 1;
            } else {
                const diff = (d - prevDate) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            }
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            prevDate = d;
        });


        
        const totalHours = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats({
            currentStreak,
            longestStreak,
            totalHours: Math.round(totalHours * 10) / 10,
            completionRate,
            heatmapData
        });
    };

    const getCellColor = (intensity) => {
        switch (intensity) {
            case 1: return 'bg-green-200';
            case 2: return 'bg-green-400';
            case 3: return 'bg-green-600';
            case 4: return 'bg-green-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Goal Streaks</h1>
                    <p className="text-sm text-gray-500">Track your consistency and study habits.</p>
                </div>
                {loading && <Icon name="Loader" className="animate-spin text-gray-400" size={20} />}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-end gap-2 mb-6">
                    <h2 className="text-4xl font-bold text-gray-900">{stats.currentStreak}</h2>
                    <span className="text-gray-500 mb-1">day streak!</span>
                    <Icon name="Flame" className={`${stats.currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'} mb-1 ml-1`} size={24} fill="currentColor" />
                </div>

                <div className="flex flex-wrap gap-1">
                    {stats.heatmapData.map((day, idx) => (
                        <div
                            key={idx}
                            title={`${day.date.toDateString()}: Level ${day.intensity}`}
                            className={`w-3 h-3 rounded-[2px] ${getCellColor(day.intensity)}`}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-gray-100 rounded-[2px]" />
                    <div className="w-3 h-3 bg-green-200 rounded-[2px]" />
                    <div className="w-3 h-3 bg-green-400 rounded-[2px]" />
                    <div className="w-3 h-3 bg-green-600 rounded-[2px]" />
                    <div className="w-3 h-3 bg-green-800 rounded-[2px]" />
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
                    <h3 className="text-orange-900 font-bold text-lg">Longest Streak</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{stats.longestStreak} <span className="text-sm font-normal text-orange-800/60">days</span></p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                    <h3 className="text-blue-900 font-bold text-lg">Total Hours</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalHours} <span className="text-sm font-normal text-blue-800/60">hrs</span></p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                    <h3 className="text-purple-900 font-bold text-lg">Completion</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.completionRate}% <span className="text-sm font-normal text-purple-800/60">rate</span></p>
                </div>
            </div>
        </div>
    );
};

export default StreaksHeatmap;
