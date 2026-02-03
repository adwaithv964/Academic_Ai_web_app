import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFocusWidget = () => {
    const [activeTask, setActiveTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Load high priority task from local storage or find the first one
        const loadTask = () => {
            try {
                const savedTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
                // Find first high priority task that is not done
                const highPriority = savedTasks.find(t => (t.priority === 'high' || t.tags?.includes('HIGH')) && t.status !== 'done');
                const anyTask = savedTasks.find(t => t.status !== 'done');

                setActiveTask(highPriority || anyTask || { title: 'No active tasks', id: 'none' });
            } catch (e) {
                console.error("Error loading tasks", e);
                setActiveTask({ title: 'No active tasks', id: 'none' });
            }
        };

        loadTask();
        window.addEventListener('storage', loadTask);
        return () => window.removeEventListener('storage', loadTask);
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optionally play sound
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Icon name="Zap" size={14} className="text-amber-500" />
                        Active Focus
                    </h3>
                    <div className="mt-2">
                        <h4 className="font-bold text-gray-900 line-clamp-1" title={activeTask?.title}>
                            {activeTask?.title || "No Task Selected"}
                        </h4>
                        {activeTask?.id !== 'none' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                HIGH PRIORITY
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 z-10">
                <div className="text-4xl font-black font-mono text-gray-800 tracking-tight">
                    {formatTime(timeLeft)}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetTimer}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        title="Reset Timer"
                    >
                        <Icon name="RotateCcw" size={18} />
                    </Button>
                    <Button
                        size="sm"
                        onClick={toggleTimer}
                        className={`${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                    >
                        {isActive ? 'Pause' : 'Start Focus'}
                    </Button>
                </div>
            </div>

            {/* Decorative Background Element */}
            <div className="absolute right-[-20px] top-[-20px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Icon name="Clock" size={120} />
            </div>
        </div>
    );
};

export default ActiveFocusWidget;
