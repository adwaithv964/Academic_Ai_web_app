import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import DeepFocusTimer from './DeepFocusTimer';
// import ZenMode from './ZenMode';
import EisenhowerMatrix from './EisenhowerMatrix';
import Soundscapes from './Soundscapes';
import StreaksHeatmap from './StreaksHeatmap';

const PowerMode = ({ onBack }) => {
    const [activeTool, setActiveTool] = useState(null);

    if (activeTool === 'timer') return <DeepFocusTimer onBack={() => setActiveTool(null)} />;
    // if (activeTool === 'zen') return <ZenMode onExit={() => setActiveTool(null)} />; // Deprecated
    if (activeTool === 'matrix') return <EisenhowerMatrix onBack={() => setActiveTool(null)} />;
    if (activeTool === 'sound') return <Soundscapes onBack={() => setActiveTool(null)} />;
    if (activeTool === 'heatmap') return <StreaksHeatmap onBack={() => setActiveTool(null)} />;

    const tools = [
        { id: 'timer', name: 'Deep Focus Timer', desc: 'Pomodoro Pro with DND & Zen mode', icon: 'Clock', color: 'text-indigo-600', bg: 'bg-indigo-100' },
        // Zen Mode moved inside Timer
        { id: 'matrix', name: 'Eisenhower Matrix', desc: 'Prioritize task quadrants', icon: 'Grid', color: 'text-blue-600', bg: 'bg-blue-100' },
        { id: 'sound', name: 'Focus Soundscapes', desc: 'Ambient background audio', icon: 'Headphones', color: 'text-rose-600', bg: 'bg-rose-100' },
        { id: 'heatmap', name: 'Goal Streaks', desc: 'Track your study consistency', icon: 'Activity', color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Power Mode Tools</h1>
            </div>

            <p className="text-gray-500">Advanced tools to maximize your productivity and focus.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map(tool => (
                    <div
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
                    >
                        <div className={`w-12 h-12 rounded-full ${tool.bg} flex items-center justify-center ${tool.color} shrink-0`}>
                            <Icon name={tool.icon} size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{tool.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">{tool.desc}</p>
                        </div>
                        <div className="ml-auto text-gray-300">
                            <Icon name="ChevronRight" size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PowerMode;
