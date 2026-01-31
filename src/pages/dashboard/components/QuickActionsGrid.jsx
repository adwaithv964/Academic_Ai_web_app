import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActionsGrid = () => {
    const navigate = useNavigate();

    const actions = [
        { label: 'Grade Predictor', icon: 'TrendingUp', path: '/grade-predictor', color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'What-If Analysis', icon: 'Calculator', path: '/what-if-analysis', color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Progress Tracker', icon: 'BarChart3', path: '/progress-tracker', color: 'text-success', bg: 'bg-success/10' },
        { label: 'Study Planner', icon: 'Calendar', path: '/study-planner', color: 'text-secondary', bg: 'bg-secondary/10' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => (
                <motion.button
                    key={action.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.bg}`}>
                        <Icon name={action.icon} size={24} className={action.color} />
                    </div>
                    <span className="font-medium text-foreground text-sm">{action.label}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default QuickActionsGrid;
