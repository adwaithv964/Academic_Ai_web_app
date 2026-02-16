import React from 'react';
import { Lock, Medal, Shield, Zap, Sun, Moon, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BadgeIcon = ({ name, className }) => {
    switch (name) {
        case 'runner_icon': return <Zap className={className} />;
        case 'shield_icon': return <Shield className={className} />;
        case 'sun_icon': return <Sun className={className} />;
        case 'moon_icon': return <Moon className={className} />;
        case 'target_icon': return <Target className={className} />;
        default: return <Medal className={className} />;
    }
};

const getTierColor = (tier) => {
    switch (tier) {
        case 'gold': return 'from-yellow-500/20 to-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] border-yellow-500/50 text-yellow-400';
        case 'silver': return 'from-slate-400/20 to-gray-400/20 shadow-[0_0_15px_rgba(148,163,184,0.3)] border-slate-400/50 text-slate-300';
        case 'bronze': return 'from-orange-700/20 to-red-800/20 shadow-[0_0_15px_rgba(194,65,12,0.3)] border-orange-700/50 text-orange-400';
        default: return 'from-purple-500/20 to-blue-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)] border-purple-500/30 text-purple-400';
    }
};

const getIconBg = (tier) => {
    switch (tier) {
        case 'gold': return 'bg-yellow-500/20 text-yellow-400';
        case 'silver': return 'bg-slate-500/20 text-slate-300';
        case 'bronze': return 'bg-orange-900/40 text-orange-400';
        default: return 'bg-purple-500/20 text-purple-400';
    }
};

const BadgeCard = ({ badge, index }) => {
    const { isUnlocked, title, description, icon, tier } = badge;
    const tierStyle = getTierColor(tier || 'bronze');
    const iconStyle = getIconBg(tier || 'bronze');

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-colors duration-300 border cursor-default ${isUnlocked ? `bg-gradient-to-br ${tierStyle}` : 'bg-gray-800/50 opacity-60 border-gray-700'}`}
                    >
                        <motion.div
                            whileHover={{ rotate: isUnlocked ? [0, -10, 10, 0] : 0 }}
                            transition={{ duration: 0.5 }}
                            className={`p-4 rounded-full mb-3 ${isUnlocked ? iconStyle : 'bg-gray-700 text-gray-500'}`}
                        >
                            <BadgeIcon name={icon} className="w-8 h-8" />
                        </motion.div>
                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[1px]">
                                <Lock className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <h4 className={`font-semibold text-center ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{title}</h4>
                        {isUnlocked && tier && tier !== 'locked' && (
                            <span className="text-xs font-mono uppercase mt-1 opacity-75">{tier}</span>
                        )}
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 border-gray-700 text-white p-3 max-w-xs z-50">
                    <p className="font-bold mb-1">{title}</p>
                    <p className="text-sm text-gray-300">{description}</p>
                    {!isUnlocked && <p className="text-xs text-red-400 mt-2 font-mono uppercase">Locked</p>}
                    {isUnlocked && <p className={`text-xs mt-2 font-mono uppercase ${getIconBg(tier).split(' ')[1]}`}>Unlocked: {tier}</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const BadgeGrid = ({ badges }) => {
    return (
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Medal className="w-5 h-5 text-purple-500" />
                Badges & Milestones
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                    <BadgeCard key={badge.id} badge={badge} index={index} />
                ))}
            </div>
        </div>
    );
};

export default BadgeGrid;
