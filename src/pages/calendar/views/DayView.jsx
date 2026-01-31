import React from 'react';
import { format } from 'date-fns';

const DayView = ({ currentDate, events, onEventClick }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900">{format(currentDate, 'EEEE')}</h2>
                <p className="text-gray-500 text-lg">{format(currentDate, 'MMMM d, yyyy')}</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {hours.map(hour => {
                    const currentTimestamp = new Date(currentDate).setHours(hour, 0, 0, 0);
                    const hourEvents = events.filter(e => {
                        // Very rough check, ideally use proper timestamp comparison
                        // e.date is normalized to Date object at midnight usually
                        // e.time is string. Need real date parsing for accurate time view.
                        // For now showing 'all day' events if they match date
                        const isSameDate = new Date(e.date).toDateString() === currentDate.toDateString();
                        // Simple string match for demo if time exists
                        const isSameHour = e.time && e.time.startsWith(format(currentTimestamp, 'hh'));
                        return isSameDate && (isSameHour || !e.time); // Show all if no time specified (all day) in first slot logic effectively
                    });

                    return (
                        <div key={hour} className="flex gap-4 mb-4 min-h-[80px]">
                            <div className="w-20 text-right pt-2 text-sm font-medium text-gray-400">
                                {format(currentTimestamp, 'h a')}
                            </div>
                            <div className="flex-1 pt-2 border-t border-gray-100 relative">
                                {hourEvents.map((evt, idx) => (
                                    <div
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(evt); }}
                                        className={`mb-2 p-3 rounded-lg border-l-4 flex items-start gap-3 cursor-pointer transition-all hover:brightness-95
                                        ${evt.color || 'bg-blue-50 border-blue-500 text-blue-700'}
                                        ${evt.color ? evt.color.replace('text-', 'border-').replace('700', '400') : 'border-blue-400'}
                                        `}
                                    >
                                        <div className={`mt-1 min-w-[16px] h-[16px] rounded-[4px] border border-current opacity-60 flex items-center justify-center`}>
                                            <svg className="w-3 h-3 opacity-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{evt.title}</div>
                                            {evt.time && <div className="text-xs opacity-70 mt-0.5">{evt.time} - {evt.location}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayView;
