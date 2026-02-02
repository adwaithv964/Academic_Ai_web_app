import React from 'react';
import { Lock, Medal, Shield, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BadgeIcon = ({ name, className }) => {
    // Map icon names to Lucide icons (simple map for now)
    switch (name) {
        case 'runner_icon': return <Zap className={className} />;
        case 'shield_icon': return <Shield className={className} />;
        default: return <Medal className={className} />;
    }
};

const BadgeCard = ({ badge }) => {
    const { isUnlocked, title, description, icon } = badge;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${isUnlocked ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/30' : 'bg-gray-800/50 opacity-60 border border-gray-700'}`}>
                        <div className={`p-4 rounded-full mb-3 ${isUnlocked ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-500'}`}>
                            <BadgeIcon name={icon} className="w-8 h-8" />
                        </div>
                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[1px]">
                                <Lock className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <h4 className={`font-semibold text-center ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{title}</h4>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 border-gray-700 text-white p-3 max-w-xs">
                    <p className="font-bold mb-1">{title}</p>
                    <p className="text-sm text-gray-300">{description}</p>
                    {!isUnlocked && <p className="text-xs text-red-400 mt-2 font-mono uppercase">Locked</p>}
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
                {badges.map(badge => (
                    <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
        </div>
    );
};

export default BadgeGrid;
