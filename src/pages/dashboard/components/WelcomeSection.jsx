import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ studentName = "Student", sharePrice = 142.50, trend = 2.4 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-8 text-primary-foreground shadow-lg mb-8"
        >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {studentName}!</h1>
                    <p className="mt-2 text-primary-foreground/80">
                        You're on track to crush your goals this semester.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                        <Icon name="TrendingUp" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary-foreground/70">Personal Share Price</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold">${sharePrice.toFixed(2)}</span>
                            <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-300' : 'text-red-300'} mb-1`}>
                                {trend >= 0 ? '+' : ''}{trend}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WelcomeSection;
