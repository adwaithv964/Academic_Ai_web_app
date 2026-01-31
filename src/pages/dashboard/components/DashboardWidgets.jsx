import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import Icon from '../../../components/AppIcon';

const SharePriceCard = () => {
    const data = [
        { value: 100 }, { value: 110 }, { value: 108 }, { value: 125 },
        { value: 132 }, { value: 140 }, { value: 138 }, { value: 145.2 }
    ];

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-48">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 font-medium text-sm">Share Price</h3>
                    <span className="text-xs font-medium bg-green-100 text-green-600 px-2 py-0.5 rounded-full">+3.8%</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">145.20</span>
                    <span className="text-xs text-gray-400">Today</span>
                </div>
            </div>

            <div className="h-20 -mx-2 -mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const MedalsCard = () => {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-48 flex flex-col">
            <h3 className="text-gray-500 font-medium text-sm mb-4">Medals</h3>
            <div className="flex items-end justify-between flex-1 px-4">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-amber-500">175</span>
                    <Icon name="Award" size={24} className="text-amber-500" />
                    <span className="text-xs text-gray-400 font-medium">GOLD</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-gray-400">67</span>
                    <Icon name="Award" size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">SILVER</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-orange-700">26</span>
                    <Icon name="Award" size={24} className="text-orange-700" />
                    <span className="text-xs text-gray-400 font-medium">BRONZE</span>
                </div>
            </div>
        </div>
    );
};

const StreaksCard = () => {
    const days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
    const checks = [true, true, true, false, true, true, true]; // Mock data

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-48 flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <h3 className="text-gray-500 font-medium text-sm">Streaks</h3>
                <span className="text-sm text-gray-400">Your track record in the last 7 days:</span>
            </div>

            <div className="flex items-center gap-2">
                <Icon name="Flame" size={32} className="text-orange-500 fill-orange-500" />
                <span className="text-4xl font-bold text-gray-900">278</span>
            </div>

            <div className="flex justify-between mt-2">
                {days.map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-bold">{day}</span>
                        {checks[i] ? (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <Icon name="Check" size={14} strokeWidth={4} />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center">
                                <Icon name="X" size={14} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export { SharePriceCard, MedalsCard, StreaksCard };
