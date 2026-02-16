import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
    { label: 'Tasks', icon: '📋', path: '/todo-list', color: 'bg-amber-100', text: 'text-amber-600' },
    { label: 'Classes', icon: '📚', path: '/classes', color: 'bg-green-100', text: 'text-green-600' },
    { label: 'Exams', icon: '✍️', path: '/exams', color: 'bg-orange-100', text: 'text-orange-600' },
    { label: 'Vacations', icon: '🏝️', path: '/vacations', color: 'bg-cyan-100', text: 'text-cyan-600' },
    { label: 'Xtra', icon: '⚡', path: '/xtra', color: 'bg-yellow-100', text: 'text-yellow-600' },
    { label: 'Focus Timer', icon: '⏳', path: '/focus-timer', color: 'bg-rose-100', text: 'text-rose-600' },
    { label: 'Ai Schedule Scan', icon: '📸', path: '/ai-scan', color: 'bg-blue-100', text: 'text-blue-600' },

    { label: 'Settings', icon: '🛠️', path: '/student-profile-settings', color: 'bg-slate-100', text: 'text-slate-600' },
    { label: 'Schedule Set Up', icon: '🗓️', path: '/schedule-setup', color: 'bg-orange-50', text: 'text-orange-500' },
];

const Menu = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-md mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
                </header>

                <div className="grid grid-cols-3 gap-4">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={index}
                            onClick={() => navigate(item.path)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 aspect-square hover:shadow-md transition-shadow active:scale-95"
                        >
                            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-3 shadow-inner`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                                {item.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
