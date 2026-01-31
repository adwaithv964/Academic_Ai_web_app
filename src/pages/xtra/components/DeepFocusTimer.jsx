import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeepFocusTimer = ({ onBack }) => {
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // work, break
    const [isDndActive, setIsDndActive] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (mode === 'work') {
                setMode('break');
                setTimeLeft(breakTime * 60);
                // Notification here
            } else {
                setMode('work');
                setTimeLeft(workTime * 60);
                // Notification here
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, workTime, breakTime]);

    // Navigation Block
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isActive && isDndActive) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isActive, isDndActive]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMode('work');
        setTimeLeft(workTime * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleIntervalChange = (type, val) => {
        const newVal = parseInt(val) || 1;
        if (type === 'work') {
            setWorkTime(newVal);
            if (mode === 'work' && !isActive) setTimeLeft(newVal * 60);
        } else {
            setBreakTime(newVal);
            if (mode === 'break' && !isActive) setTimeLeft(newVal * 60);
        }
    };

    // Zen Mode Fullscreen Logic
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                if (isZenMode && document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (!isZenMode && document.fullscreenElement) {
                    await document.exitFullscreen();
                }
            } catch (err) {
                console.error("Error toggling fullscreen:", err);
            }
        };
        enterFullscreen();
    }, [isZenMode]);

    const containerClasses = isZenMode
        ? "fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300"
        : "space-y-6 animate-in slide-in-from-right duration-300";

    return (
        <div className={containerClasses}>
            {/* Header / Controls */}
            <div className={`flex items-center justify-between w-full max-w-4xl ${isZenMode ? 'absolute top-8 px-8' : ''}`}>
                <div className="flex items-center gap-4">
                    {!isZenMode && (
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Icon name="ArrowLeft" size={24} />
                        </button>
                    )}
                    <h1 className={`${isZenMode ? 'text-white/50' : 'text-gray-900'} text-2xl font-bold transition-colors`}>
                        {isZenMode ? (mode === 'work' ? 'Deep Work' : 'Break Time') : 'Deep Focus Timer'}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Zen Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isZenMode ? 'text-white' : 'text-gray-500'}`}>
                            Zen Mode
                        </span>
                        <button
                            onClick={() => setIsZenMode(!isZenMode)}
                            className={`p-2 rounded-full transition-colors ${isZenMode ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                        >
                            <Icon name={isZenMode ? "Minimize" : "Maximize"} size={20} />
                        </button>
                    </div>

                    {/* DND Toggle - Hide in Zen Mode to reduce clutter, or keep discreetly? Hiding for minimalism as requested. */}
                    {!isZenMode && (
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isDndActive ? 'text-red-500' : 'text-gray-500'}`}>
                                {isDndActive ? 'DND Active' : 'DND Off'}
                            </span>
                            <button
                                onClick={() => setIsDndActive(!isDndActive)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isDndActive ? 'bg-red-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDndActive ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Timer Display */}
            <div className={`transition-all duration-500 ${isZenMode
                ? 'scale-125 md:scale-150'
                : 'bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-2xl text-white text-center relative overflow-hidden shadow-xl w-full'
                }`}>
                {/* Background decoration for normal mode */}
                {!isZenMode && <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}

                <div className={`relative z-10 flex flex-col items-center ${isZenMode ? 'text-white' : ''}`}>
                    <div className="flex justify-center gap-8 mb-8">
                        <div className="text-center">
                            <label className={`text-xs uppercase tracking-wider mb-1 block ${isZenMode ? 'text-white/40' : 'text-indigo-300'}`}>Work (min)</label>
                            <input
                                type="number"
                                value={workTime}
                                onChange={(e) => handleIntervalChange('work', e.target.value)}
                                className={`w-16 border rounded-lg py-1 px-2 text-center focus:outline-none ${isZenMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/10 border-white/20 text-white focus:border-indigo-400'}`}
                                disabled={isActive}
                            />
                        </div>
                        <div className="text-center">
                            <label className={`text-xs uppercase tracking-wider mb-1 block ${isZenMode ? 'text-white/40' : 'text-indigo-300'}`}>Break (min)</label>
                            <input
                                type="number"
                                value={breakTime}
                                onChange={(e) => handleIntervalChange('break', e.target.value)}
                                className={`w-16 border rounded-lg py-1 px-2 text-center focus:outline-none ${isZenMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/10 border-white/20 text-white focus:border-indigo-400'}`}
                                disabled={isActive}
                            />
                        </div>
                    </div>

                    <div className="text-9xl font-bold font-mono mb-8 tracking-tighter tabular-nums text-shadow-sm">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={toggleTimer}
                            className={`w-40 h-14 text-xl font-bold transition-all shadow-lg hover:shadow-xl ${isActive
                                ? 'bg-red-500 hover:bg-red-600 border-red-400'
                                : (isZenMode ? 'bg-white text-slate-900 hover:bg-gray-100' : 'bg-indigo-500 hover:bg-indigo-600')
                                }`}
                        >
                            {isActive ? 'Stop' : 'Start Focus'}
                        </Button>
                        <Button
                            onClick={resetTimer}
                            variant="ghost"
                            className={`h-14 w-14 p-0 rounded-full ${isZenMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                            <Icon name="RotateCcw" size={24} />
                        </Button>
                    </div>

                    <p className={`mt-8 text-sm transition-opacity ${isZenMode ? 'text-white/50' : 'text-indigo-200'}`}>
                        {mode === 'work' ? 'Stay focused. Ignore distractions.' : 'Take a deep breath. Relax.'}
                    </p>
                </div>
            </div>

            {!isZenMode && (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-start gap-3 w-full">
                    <Icon name="AlertTriangle" className="text-orange-500 mt-0.5" size={18} />
                    <div>
                        <h4 className="font-bold text-orange-800 text-sm">DND Mode</h4>
                        <p className="text-xs text-orange-700 mt-1">
                            Enabling "Do Not Disturb" will warn you if you try to leave this page or close the tab while the timer is running.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeepFocusTimer;
