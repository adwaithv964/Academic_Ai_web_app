import React from 'react';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';

const FloatingNav = ({ currentView, onViewChange }) => {
    const views = [
        { id: 'year', label: 'Year' },
        { id: 'month', label: 'Month' },
        { id: 'multi-week', label: 'Multi-Week' },
        { id: 'week', label: 'Week' },
        { id: 'multi-day', label: 'Multi-Day' },
        { id: 'day', label: 'Day' },
        { id: 'agenda', label: 'Agenda' },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-800/90 backdrop-blur-md text-white p-1 rounded-full shadow-2xl flex items-center gap-1 border border-gray-700">
                {views.map((view) => (
                    <button
                        key={view.id}
                        onClick={() => onViewChange(view.id)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            currentView === view.id
                                ? "bg-gray-600 text-white shadow-sm"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                        )}
                    >
                        {view.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FloatingNav;
