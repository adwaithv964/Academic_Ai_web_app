import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { startTimer, pauseTimer, resetTimer, setMode } from '../../store/slices/focusSlice';

const FocusTimer = () => {
    const dispatch = useDispatch();
    const { isActive, timeLeft, mode } = useSelector(state => state.focus);

    // No local timer effect needed, Header handles the tick!

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isActive) {
            dispatch(pauseTimer());
        } else {
            dispatch(startTimer());
        }
    };

    const handleReset = () => {
        dispatch(resetTimer());
    };

    const handleSetMode = (newMode) => {
        dispatch(setMode(newMode));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Focus Timer</h1>
                <p className="text-gray-500">Stay productive with the Pomodoro technique</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md text-center">
                <div className="flex justify-center gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                    {['focus', 'shortBreak', 'longBreak'].map(m => (
                        <button
                            key={m}
                            onClick={() => handleSetMode(m)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </button>
                    ))}
                </div>

                <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-8 opacity-20 ${mode === 'focus' ? 'border-blue-500' : mode === 'shortBreak' ? 'border-green-500' : 'border-purple-500'}`}></div>
                    <div className="text-6xl font-black font-mono text-gray-800">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button
                        size="lg"
                        onClick={toggleTimer}
                        className={`w-32 ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary text-white hover:bg-primary/90'}`}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleReset} iconName="RotateCcw" />
                </div>
            </div>
        </div>
    );
};

export default FocusTimer;
