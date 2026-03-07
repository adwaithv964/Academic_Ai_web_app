import React from 'react';
import { format, addDays } from 'date-fns';

const MultiDayView = ({ currentDate, events, onEventClick }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const daysToShow = 3;
    const days = Array.from({ length: daysToShow }, (_, i) => addDays(currentDate, i));

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex border-b border-gray-200">
                <div className="w-16 border-r border-gray-100 bg-gray-50/50"></div>
                {days.map(day => (
                    <div key={day.toString()} className="flex-1 p-4 text-center border-r border-gray-100 last:border-r-0">
                        <h2 className="text-lg font-bold text-gray-900">{format(day, 'EEEE')}</h2>
                        <p className="text-gray-500">{format(day, 'MMM d')}</p>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {hours.map(hour => (
                    <div key={hour} className="flex min-h-[80px]">
                        {/* Time Column */}
                        <div className="w-16 text-right pr-4 pt-2 text-sm font-medium text-gray-400 border-r border-gray-100 bg-gray-50/10">
                            {format(new Date().setHours(hour), 'h a')}
                        </div>

                        {/* Days Columns */}
                        {days.map(day => {
                            const currentTimestamp = new Date(day).setHours(hour, 0, 0, 0);
                            const hourEvents = events.filter(e => {
                                const isSameDate = new Date(e.date).toDateString() === day.toDateString();
                                
                                let isSameHour = false;
                                if (e.time) {
                                    const eventHour = parseInt(e.time.split(':')[0], 10);
                                    isSameHour = eventHour === hour;
                                }

                                let shouldRender = isSameDate && isSameHour;
                                if (isSameDate && !e.time && hour === 0) {
                                    shouldRender = true;
                                }

                                return shouldRender;
                            });

                            return (
                                <div key={day.toString()} className="flex-1 border-r border-gray-100 border-b border-gray-50 last:border-r-0 relative p-1 group hover:bg-gray-50/30 transition-colors">
                                    {hourEvents.map((evt, idx) => (
                                        <div
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(evt); }}
                                            className={`mb-1 p-2 rounded-md border-l-4 flex items-start gap-2 cursor-pointer transition-all hover:brightness-95
                                            ${evt.color || 'bg-blue-50 border-blue-500 text-blue-700'}
                                            ${evt.color ? evt.color.replace('text-', 'border-').replace('700', '400') : 'border-blue-400'}
                                            `}
                                        >
                                            <div className={`mt-0.5 min-w-[12px] h-[12px] rounded-[3px] border border-current opacity-60 flex items-center justify-center`}>
                                                <svg className="w-2.5 h-2.5 opacity-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-bold truncate text-xs">{evt.title}</div>
                                                {evt.time && <div className="opacity-70 truncate text-[10px]">{evt.time}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiDayView;
