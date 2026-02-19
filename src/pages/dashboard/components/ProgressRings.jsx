import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const CircularProgress = ({ value, max, color, label, icon }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / max) * circumference;

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative h-24 w-24">
                <svg className="h-full w-full -rotate-90 transform">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                    />
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={color}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-foreground">
                    <Icon name={icon} size={20} className={color.replace('text-', 'text-opacity-80 ')} />
                </div>
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-foreground">{value}<span className="text-xs text-muted-foreground">/{max}</span></p>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
        </div>
    );
};

const ProgressRings = () => {
    
    const stats = [
        { label: 'Study Hours', value: 4.5, max: 6.0, color: 'text-primary', icon: 'Clock' },
        { label: 'Daily Tasks', value: 3, max: 5, color: 'text-success', icon: 'CheckSquare' },
        { label: 'Focus Score', value: 85, max: 100, color: 'text-accent', icon: 'Zap' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold text-foreground mb-6">Daily Progress</h3>
            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <CircularProgress key={index} {...stat} />
                ))}
            </div>
        </motion.div>
    );
};

export default ProgressRings;
