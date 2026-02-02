import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BookOpen } from 'lucide-react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-900/50 rounded-2xl border border-gray-800 p-6 ${className}`}>
        {children}
    </div>
);

const UserStatsDonut = ({ value, label, color }) => {
    const data = [
        { name: 'Completed', value: value },
        { name: 'Remaining', value: 100 - value }
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={55}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="completed" fill={color} />
                            <Cell key="remaining" fill="#374151" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold text-white">{value}%</span>
                </div>
            </div>
            <p className="mt-2 text-sm text-gray-400 font-medium">{label}</p>
        </div>
    );
};

const CourseAchievements = () => {
    // Mock data for now, would ideally come from backend analyzing Tasks or Course Progress
    const syllabusProgress = 65;
    const assignmentAceRate = 88;

    return (
        <Card className="mb-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Academic Milestones
            </h3>

            <div className="flex justify-around items-center">
                <UserStatsDonut
                    value={syllabusProgress}
                    label="Syllabus Covered"
                    color="#3B82F6"
                />
                <div className="w-px h-24 bg-gray-800"></div>
                <UserStatsDonut
                    value={assignmentAceRate}
                    label="Assignment Ace"
                    color="#10B981"
                />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-400">
                    Keep pushing! You're <span className="text-blue-400">ahead of schedule</span> in standard math tracks.
                </p>
            </div>
        </Card>
    );
};

export default CourseAchievements;
