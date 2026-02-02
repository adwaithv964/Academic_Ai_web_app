import React from 'react';
import { Clock, Flame, CheckCircle, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card className="bg-white/5 border-none shadow-lg backdrop-blur-sm">
        <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </CardContent>
    </Card>
);

const HeroStats = ({ stats }) => {
    const { totalFocusTime, currentStreak, tasksCrushed, averageEfficiency } = stats;

    const getEfficiencyColor = (eff) => {
        if (eff >= 90) return 'text-green-500 bg-green-500';
        if (eff >= 70) return 'text-yellow-500 bg-yellow-500';
        return 'text-red-500 bg-red-500';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                icon={Clock}
                label="Total Focus Time"
                value={totalFocusTime}
                color="text-blue-500 bg-blue-500"
            />
            <StatCard
                icon={Flame}
                label="Current Streak"
                value={`${currentStreak} Days`}
                color="text-orange-500 bg-orange-500"
            />
            <StatCard
                icon={CheckCircle}
                label="Tasks Crushed"
                value={tasksCrushed}
                color="text-purple-500 bg-purple-500"
            />
            <StatCard
                icon={Gauge}
                label="Avg. Efficiency"
                value={`${averageEfficiency}%`}
                color={getEfficiencyColor(averageEfficiency)}
            />
        </div>
    );
};

export default HeroStats;
