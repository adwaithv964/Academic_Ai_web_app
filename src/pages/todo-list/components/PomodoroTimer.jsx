import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TimeSpinner from '../../focus-timer/components/TimeSpinner';

const PomodoroTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); 
    const [totalDuration, setTotalDuration] = useState(25 * 60); 

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') { setTimeLeft(25 * 60); setTotalDuration(25 * 60); }
        if (mode === 'short') { setTimeLeft(5 * 60); setTotalDuration(5 * 60); }
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') { setTimeLeft(25 * 60); setTotalDuration(25 * 60); }
        if (newMode === 'short') { setTimeLeft(5 * 60); setTotalDuration(5 * 60); }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeChange = (newSeconds) => {
        setTimeLeft(newSeconds);
        setTotalDuration(newSeconds);
    };

    const progress = totalDuration > 0 ? 1 - (timeLeft / totalDuration) : 0;

    return (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Timer" size={20} className="text-primary" />
                    Pomodoro Focus
                </h3>
                <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                    {['focus', 'short'].map((m) => (
                        <button
                            key={m}
                            onClick={() => changeMode(m)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === m ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {m === 'focus' ? 'Focus' : 'Short'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative flex flex-col items-center justify-center py-4">
                {/* Simple Ring using SVG */}
                <div className="relative h-48 w-48 mb-4">
                    <svg className="h-full w-full -rotate-90 transform">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                        <motion.circle
                            cx="96" cy="96" r="88"
                            stroke="currentColor" strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
                            strokeLinecap="round"
                            className="text-primary"
                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress) }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        {isActive ? (
                            <span className="text-5xl font-mono font-bold text-foreground tracking-tighter">
                                {formatTime(timeLeft)}
                            </span>
                        ) : (
                            <div className="scale-75">
                                <TimeSpinner
                                    totalSeconds={timeLeft}
                                    onChange={handleTimeChange}
                                    isDark={false}
                                    showHours={mode === 'focus'}
                                    minMinutes={mode === 'short' ? 5 : 0}
                                    maxMinutes={mode === 'short' ? 15 : 59}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button onClick={toggleTimer} size="lg" className="w-32">
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button variant="outline" onClick={resetTimer} iconName="RotateCcw" />
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
