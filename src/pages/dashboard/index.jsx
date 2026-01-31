import React from 'react';
import { SharePriceCard, MedalsCard, StreaksCard } from './components/DashboardWidgets';
import Icon from '../../components/AppIcon';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    // Mock Data for "Goals"
    const totalGoal = 784;
    const currentStudied = 741; // 95%

    // Mock Data for "Courses"
    const courses = [
        { name: 'Personal Development', studied: '375h/333h', progress: 112, color: 'text-green-500', bar: 'bg-green-500' },
        { name: 'Gesundheit', studied: '160h/175h', progress: 91, color: 'text-green-500', bar: 'bg-green-500' },
        { name: 'Unterhaltung', studied: '77h/100h', progress: 77, color: 'text-yellow-500', bar: 'bg-yellow-500' },
        { name: 'Kultur', studied: '60h/100h', progress: 60, color: 'text-yellow-500', bar: 'bg-yellow-500' },
        { name: 'StudyMate', studied: '36h/52h', progress: 69, color: 'text-yellow-500', bar: 'bg-yellow-500' },
    ];

    // Mock Data for Activities Pie Chart
    const pieData = [
        { name: 'Studying', value: 65, color: '#4b5563' }, // gray-600
        { name: 'Reading', value: 20, color: '#9ca3af' }, // gray-400
        { name: 'Writing', value: 10, color: '#d1d5db' }, // gray-300
        { name: 'Other', value: 5, color: '#f3f4f6' }, // gray-100
    ];

    return (
        <div className="h-full space-y-6">

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SharePriceCard />
                <MedalsCard />
                <StreaksCard />
            </div>

            {/* Middle Row: Goals & Calendar? Or Goals and Activities? */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Goals Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">Goals</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-bold text-gray-900 text-blue-600">{currentStudied}h</span>
                                <span className="text-sm text-gray-400">/ {totalGoal}h</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400">Total</span>
                            <div className="text-2xl font-bold text-gray-900">1.640</div>
                            <span className="text-xs text-gray-400">SESSIONS</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-blue-600">Study 28m every day to achieve goal</span>
                            <span className="font-bold">95%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[95%]" />
                        </div>
                    </div>
                </div>

                {/* Courses List */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Courses · 5 &gt;</h3>
                        <div className="flex gap-4 text-xs text-gray-400">
                            <span>Chart</span>
                            <span className="text-gray-900 font-medium">Table</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {courses.map((course, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 truncate w-32">{course.name}</span>
                                <span className="text-gray-400 text-xs">{course.studied}</span>
                                <div className={`font-bold ${course.color}`}>{course.progress}%</div>
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${course.bar}`} style={{ width: `${Math.min(course.progress, 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activities Pie Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Activities · 17 &gt;</h3>
                    </div>
                    <div className="h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centered Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-700">67%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
