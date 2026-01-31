import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        id: 'task',
        title: 'Task',
        description: 'Record tasks, set reminders, free up your mind, and effortlessly manage everything for enhanced productivity.',
        content: (
            <div className="relative w-64 h-64 bg-blue-50/50 rounded-full flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-xl text-xs shadow-sm text-blue-600"
                >
                    Pick up dry Cleaning
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute top-12 right-2 bg-white px-3 py-1.5 rounded-xl text-xs shadow-sm text-blue-600"
                >
                    Go Grocery
                </motion.div>
                <div className="text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md text-blue-700 mb-2"
                    >
                        Order Milk
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-blue-100 px-5 py-3 rounded-2xl text-lg font-bold shadow-sm text-blue-800"
                    >
                        Yoga class
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-8 left-6 bg-white px-3 py-1.5 rounded-xl text-xs shadow-sm text-blue-600"
                >
                    Book Tickets
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-12 right-6 bg-white px-3 py-1.5 rounded-xl text-xs shadow-sm text-blue-600"
                >
                    Team Meeting
                </motion.div>
            </div>
        )
    },
    {
        id: 'calendar',
        title: 'Calendar',
        description: 'Easily schedule tasks with various calendar views like "Day, Week, Month", gaining clear insights into your schedule.',
        content: (
            <div className="w-56 h-72 bg-white border border-gray-200 rounded-[2rem] shadow-sm p-4 flex flex-col items-center">
                <div className="w-full h-4 bg-gray-100 rounded-full mb-4"></div>
                <div className="grid grid-cols-3 gap-2 w-full flex-1">
                    <div className="col-span-1 row-span-2 bg-red-200 rounded-xl"></div>
                    <div className="col-span-1 row-span-1 bg-yellow-100 rounded-xl mt-4"></div>
                    <div className="col-span-1 row-span-3 bg-blue-200 rounded-xl"></div>
                    <div className="col-span-1 row-span-2 bg-red-300 rounded-xl -mt-2"></div>
                    <div className="col-span-1 row-span-2 bg-gray-200 rounded-xl"></div>
                    <div className="col-span-1 row-span-1 bg-blue-300 rounded-xl"></div>
                    <div className="col-span-1 row-span-1 bg-yellow-200 rounded-xl"></div>
                </div>
            </div>
        )
    },
    {
        id: 'countdown',
        title: 'Countdown',
        description: 'Easily record birthdays, anniversaries, exams and deadlines, and keep every important moment in life and work remembered.',
        content: (
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Background Calendar */}
                <motion.div
                    className="absolute top-4 left-4 w-48 h-48 bg-gray-50 rounded-2xl p-3 shadow-inner transform -rotate-6"
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: -6 }}
                >
                    <div className="grid grid-cols-7 gap-1 text-center text-[0.5rem] text-gray-400">
                        <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} className={`aspect-square flex items-center justify-center rounded-full ${i === 12 ? 'bg-red-100 text-red-500 font-bold border border-red-200' : ''}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Foreground Card */}
                <motion.div
                    className="absolute bottom-4 right-4 w-40 h-48 bg-white rounded-2xl shadow-lg p-3 flex flex-col justify-between transform rotate-3"
                    initial={{ opacity: 0, y: 20, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: 3 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="w-full h-24 bg-orange-100 rounded-xl mb-2 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">🎂</div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-800">12</span>
                            <span className="text-xs text-gray-500">Days</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">Birthday</div>
                        <div className="text-[0.6rem] text-gray-400">Days until Jun 13 (Tue)</div>
                    </div>
                </motion.div>
            </div>
        )
    },
    {
        id: 'matrix',
        title: 'Eisenhower Matrix',
        description: 'Focusing on important and urgent tasks by categorizing them based on their significance, enhances task efficiency.',
        content: (
            <div className="w-64 h-64 bg-white rounded-3xl shadow-sm p-2 grid grid-cols-2 grid-rows-2 gap-2">
                <div className="bg-red-50 rounded-2xl p-2 flex flex-col gap-1.5 border border-red-100">
                    <div className="h-1.5 w-8 bg-red-200 rounded-full"></div>
                    <div className="h-1 w-full bg-red-100 rounded-full"></div>
                    <div className="h-1 w-2/3 bg-red-100 rounded-full"></div>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-2 flex flex-col gap-1.5 border border-yellow-100">
                    <div className="h-1.5 w-8 bg-yellow-200 rounded-full"></div>
                    <div className="h-1 w-full bg-yellow-100 rounded-full"></div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-2 flex flex-col gap-1.5 border border-blue-100">
                    <div className="h-1.5 w-8 bg-blue-200 rounded-full"></div>
                    <div className="h-1 w-full bg-blue-100 rounded-full"></div>
                    <div className="h-1 w-3/4 bg-blue-100 rounded-full"></div>
                </div>
                <div className="bg-green-50 rounded-2xl p-2 flex flex-col gap-1.5 border border-green-100">
                    <div className="h-1.5 w-8 bg-green-200 rounded-full"></div>
                    <div className="h-1 w-full bg-green-100 rounded-full"></div>
                </div>
            </div>
        )
    },
    {
        id: 'pomodoro',
        title: 'Pomodoro',
        description: 'Concentration breeds excellence. Use the Pomodoro to help you complete tasks more systematically and enhance efficiency.',
        content: (
            <div className="w-64 h-64 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * 0.25}
                            className="text-blue-500"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">24:58</span>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-1 h-3 bg-blue-500 rounded-full mx-0.5"></div>
                            <div className="w-1 h-3 bg-blue-500 rounded-full mx-0.5"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'habit',
        title: 'Habit Tracker',
        description: 'Good habits are the key to all success. Record each check-in diligently, collectively witnessing your perseverance and growth.',
        content: (
            <div className="w-56 h-72 bg-gray-50 rounded-[2.5rem] p-4 relative overflow-hidden">
                <div className="absolute top-10 left-8 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center transform rotate-12">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="absolute top-24 right-6 w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center transform -rotate-6">
                    <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="absolute bottom-20 left-12 w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center transform -rotate-12">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center transform rotate-6">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        )
    },
    {
        id: 'welcome',
        title: "Your planner's ready to go",
        description: "Organization & self-management aren't just helpful - they've been shown to increase academic progress by as much as 2.4×. With MyStudyLife, you've got the tools to make it happen.",
        content: (
            <div className="flex items-center justify-center p-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-48 h-48 flex items-center justify-center"
                >
                    {/* Party Popper Effect */}
                    <div className="text-9xl filter drop-shadow-2xl">🎉</div>

                    {/* Decorative elements */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-4 -right-4 text-4xl"
                    >
                        ✨
                    </motion.div>
                    <motion.div
                        animate={{ y: [10, -10, 10], rotate: [0, -10, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                        className="absolute -bottom-2 -left-2 text-4xl"
                    >
                        🎈
                    </motion.div>
                </motion.div>
            </div>
        )
    }
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            navigate('/');
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-8 px-4">
            {/* Header */}
            <div className="w-full flex justify-end px-4">
                <button onClick={handleSkip} className="text-gray-400 hover:text-white transition-colors text-sm">
                    Skip {'>'}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center w-full"
                    >
                        {/* Visual */}
                        <div className="mb-12">
                            {slides[currentSlide].content}
                        </div>

                        {/* Text */}
                        <div className="text-center space-y-4 px-6">
                            <h2 className="text-3xl font-bold">{slides[currentSlide].title}</h2>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {slides[currentSlide].description}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Controls */}
            <div className="w-full max-w-md space-y-8">
                <Button
                    onClick={handleNext}
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg"
                >
                    Continue
                </Button>

                {/* Pagination Dots */}
                <div className="flex justify-center space-x-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-blue-600 w-4' : 'bg-gray-600'
                                }`}
                        />
                    ))}
                </div>

                {/* Bottom Bar/Indicator to match iOS style */}
                <div className="flex justify-center pt-2">
                    <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
