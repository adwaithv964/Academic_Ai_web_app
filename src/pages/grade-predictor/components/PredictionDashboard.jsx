import React from 'react';
import { motion } from 'framer-motion';
import ProbabilityDistributionChart from './ProbabilityDistributionChart';
import AICoach from './AICoach';
import Icon from '../../../components/AppIcon';

const PredictionDashboard = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-white/50 space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="animate-pulse tracking-wide">AI Engine Simulating Scenarios...</p>
            </div>
        );
    }

    if (!data) return null;

    // Handles both old and new data structures gracefully
    const stats = data.stats || {};
    const aiAnalysis = data.aiAnalysis || data.aiInsights || {};
    const parameters = data.parameters;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Most Likely Grade */}
                <div className="bg-card/40 backdrop-blur-md rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Most Likely Outcome</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-foreground">{stats.predictedGrade}%</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">Median</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Based on {stats.simulationCount} simulations</p>
                    </div>
                </div>

                {/* Optimistic Case */}
                <div className="bg-card/40 backdrop-blur-md rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Icon name="ArrowUpRight" size={16} className="text-green-500" />
                            <h4 className="text-sm font-medium text-green-500">Best Case</h4>
                        </div>
                        <span className="text-3xl font-bold text-foreground">{stats.rangeHigh}%</span>
                        <p className="text-xs text-muted-foreground mt-2">Top 10% performance path</p>
                    </div>
                </div>

                {/* Conservative Case */}
                <div className="bg-card/40 backdrop-blur-md rounded-xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Icon name="Shield" size={16} className="text-amber-500" />
                            <h4 className="text-sm font-medium text-amber-500">Safe Estimate</h4>
                        </div>
                        <span className="text-3xl font-bold text-foreground">{stats.rangeLow}%</span>
                        <p className="text-xs text-muted-foreground mt-2">Conservative projection</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-card/30 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-xl">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Activity" className="text-primary" />
                        Probability Mapped
                    </h3>
                    <div className="h-64 w-full">
                        <ProbabilityDistributionChart data={stats.distribution} />
                    </div>

                    {/* Parameters Used Badge */}
                    {parameters && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground flex items-center gap-2">
                                <Icon name="Zap" size={12} />
                                Volatility: <span className="text-foreground">{parameters.volatility}</span>
                            </div>
                            {parameters.remainingWeight && (
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground flex items-center gap-2">
                                    <Icon name="Target" size={12} />
                                    Est. Weight: <span className="text-foreground">{Math.round(parameters.remainingWeight * 100)}%</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* AI Analysis Section */}
                <div className="bg-gradient-to-br from-primary/5 to-violet-500/10 backdrop-blur-md rounded-xl border border-primary/20 p-6 shadow-xl">
                    <AICoach insights={aiAnalysis} />
                </div>
            </div>
        </motion.div>
    );
};

export default PredictionDashboard;
