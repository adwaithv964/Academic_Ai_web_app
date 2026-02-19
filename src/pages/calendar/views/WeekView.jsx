import React from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addDays,
    isSameDay
} from 'date-fns';

const WeekView = ({ currentDate, events, onDateClick, onEventClick }) => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const hours = Array.from({ length: 24 }, (_, i) => i); 

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-4 border-r border-gray-100 bg-gray-50/50"></div> {/* Time Label Column */}
                {days.map(day => (
                    <div key={day.toString()} className={`p-4 text-center border-r border-gray-100 ${isSameDay(day, new Date()) ? 'bg-blue-50/30' : ''}`}>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{format(day, 'EEE')}</div>
                        <div className={`text-xl font-bold ${isSameDay(day, new Date()) ? 'text-primary' : 'text-gray-900'}`}>
                            {format(day, 'd')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-8 min-h-[60px]">
                        {/* Time Label */}
                        <div className="border-r border-b border-gray-100 p-2 text-xs text-gray-400 text-right pr-4 transform -translate-y-3">
                            {format(new Date().setHours(hour), 'h a')}
                        </div>

                        {/* Cells */}
                        {days.map(day => {
                            const currentHourEvents = events.filter(e =>
                                isSameDay(e.date, day) &&
                                
                                
                                (e.time && e.time.startsWith(format(new Date().setHours(hour), 'hh')))
                            );

                            return (
                                <div key={day.toString()} className="border-r border-b border-gray-100 relative group hover:bg-gray-50/50">
                                    {currentHourEvents.map((evt, idx) => (
                                        <div
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(evt); }}
                                            className={`absolute inset-x-1 top-1 bottom-1 p-1.5 rounded-md text-[10px] leading-tight font-medium border-l-4 overflow-hidden cursor-pointer transition-all hover:brightness-95
                                            ${evt.color || 'bg-blue-100 text-blue-700 border-blue-500'}
                                            ${evt.color ? evt.color.replace('text-', 'border-').replace('700', '400') : 'border-blue-400'}
                                            `}
                                        >
                                            <div className="font-bold truncate">{evt.title}</div>
                                            {evt.time && <div className="opacity-80 truncate">{evt.time}</div>}
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

export default WeekView;
