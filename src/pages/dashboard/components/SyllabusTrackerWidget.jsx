import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import { tasks as tasksApi, courses as coursesApi, sessions as sessionsApi } from '../../../services/api';

import { useAuth } from '../../../contexts/AuthContext';

const SyllabusTrackerWidget = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        syllabusCovered: 0,
        assignmentAce: 0
    });

    const Donut = ({ data, label, subLabel, color }) => (
        <div className="flex flex-col items-center justify-center relative">
            <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={28}
                            outerRadius={40}
                            paddingAngle={5} 
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            cornerRadius={4}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-xl font-bold ${color}`}>
                        {data[0]?.value}%
                    </span>
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-700 -mt-2">{label}</p>
            <p className="text-xs text-gray-400">{subLabel}</p>
        </div>
    );

    useEffect(() => {
        if (!currentUser) return;

        const fetchStats = async () => {
            try {
                
                const [allTasks, allCourses] = await Promise.all([
                    tasksApi.list(),
                    coursesApi.list()
                ]);

                
                const totalTasks = allTasks.length;
                const completedTasks = allTasks.filter(t => t.completed || t.status === 'done').length;
                const aceRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                
                
                let totalProgress = 0;
                let courseCount = 0;

                if (allCourses.length > 0) {
                    allCourses.forEach(c => {
                        
                        const p = parseFloat(c.progress) || 0;
                        totalProgress += p;
                        courseCount++;
                    });
                }

                const syllabusRate = courseCount > 0 ? Math.round(totalProgress / courseCount) : 0;

                setStats({
                    syllabusCovered: syllabusRate,
                    assignmentAce: aceRate
                });

            } catch (error) {
                console.error("Failed to load academic stats", error);
            }
        };

        fetchStats();
    }, [currentUser]);

    const coverageData = [
        { name: 'Covered', value: Number.isFinite(stats.syllabusCovered) ? stats.syllabusCovered : 0, color: '#3b82f6' }, 
        { name: 'Remaining', value: Number.isFinite(stats.syllabusCovered) ? Math.max(0, 100 - stats.syllabusCovered) : 100, color: '#eff6ff' },
    ];

    const assignmentData = [
        { name: 'Ace', value: Number.isFinite(stats.assignmentAce) ? stats.assignmentAce : 0, color: '#10b981' }, 
        { name: 'Missed', value: Number.isFinite(stats.assignmentAce) ? Math.max(0, 100 - stats.assignmentAce) : 100, color: '#f0fdf4' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <Icon name="BookOpen" size={20} className="text-pink-500" />
                    Academic Milestones
                </h3>
            </div>

            <div className="flex-1 flex items-center justify-around">
                <Donut
                    data={coverageData}
                    label="Syllabus"
                    subLabel="Covered"
                    color="text-blue-500"
                />
                <div className="w-px h-24 bg-gray-100 mx-2" />
                <Donut
                    data={assignmentData}
                    label="Assignments"
                    subLabel="Ace Rate"
                    color="text-green-500"
                />
            </div>
        </div>
    );
};

export default SyllabusTrackerWidget;
