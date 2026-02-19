import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { startTimer, pauseTimer, resetTimer, setTask, setTimeLeft, setInitialDuration } from '../../../store/slices/focusSlice';
import TimeSpinner from '../../focus-timer/components/TimeSpinner';

const ActiveFocusWidget = () => {
    const dispatch = useDispatch();
    const { isActive, timeLeft, task: activeTask, mode } = useSelector(state => state.focus);

    
    useEffect(() => {
        
        const loadTask = () => {
            if (activeTask) return; 

            try {
                const savedTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
                
                const highPriority = savedTasks.find(t => (t.priority === 'high' || t.tags?.includes('HIGH')) && t.status !== 'done');
                const anyTask = savedTasks.find(t => t.status !== 'done');

                const suggestedTask = highPriority || anyTask;
                if (suggestedTask) {
                    dispatch(setTask({ id: suggestedTask.id, title: suggestedTask.title }));
                }
            } catch (e) {
                console.error("Error loading tasks", e);
            }
        };

        loadTask();
        window.addEventListener('storage', loadTask);
        return () => window.removeEventListener('storage', loadTask);
    }, [activeTask, dispatch]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleToggle = () => {
        if (isActive) {
            dispatch(pauseTimer());
        } else {
            dispatch(startTimer());
        }
    };

    const handleReset = () => {
        dispatch(resetTimer());
    };

    const handleTimeChange = (newSeconds) => {
        dispatch(setInitialDuration(newSeconds));
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden group gap-4">
            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <Icon name="Zap" size={14} className="text-amber-500" />
                        Active Focus
                    </h3>
                    <div className="mt-2">
                        {/* Task Title Removed as per request */}
                        {activeTask?.id && activeTask.id !== 'none' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                {mode === 'focus' ? 'FOCUS MODE' : Object.keys({ shortBreak: 'SHORT BREAK', longBreak: 'LONG BREAK' })[mode] || mode.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between z-10 w-full">
                <div className="text-4xl font-black font-mono text-gray-800 tracking-tight">
                    {isActive ? (
                        formatTime(timeLeft)
                    ) : (
                        <div className="scale-75 origin-left -ml-4">
                            <TimeSpinner
                                totalSeconds={timeLeft}
                                onChange={handleTimeChange}
                                showHours={mode === 'focus' || mode === 'longBreak'}
                                minMinutes={mode === 'shortBreak' ? 5 : 0}
                                maxMinutes={mode === 'shortBreak' ? 15 : 59}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleReset}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        title="Reset Timer"
                    >
                        <Icon name="RotateCcw" size={18} />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleToggle}
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
