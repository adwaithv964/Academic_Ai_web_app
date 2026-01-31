import React from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    addDays,
    isToday,
    addWeeks
} from 'date-fns';

const MultiWeekView = ({ currentDate, events, onDateClick, onEventClick }) => {
    // Show 2 weeks starting from the week of currentDate
    const startOfFirstWeek = startOfWeek(currentDate);
    const endOfFirstWeek = endOfWeek(currentDate);
    const startOfSecondWeek = addWeeks(startOfFirstWeek, 1);
    const endOfSecondWeek = endOfWeek(startOfSecondWeek);

    const renderWeek = (start, end) => {
        let day = start;
        const days = [];
        while (day <= end) {
            const formattedDate = format(day, 'd');
            const cloneDay = day;
            const dayEvents = events.filter(e =>
                new Date(e.date).toDateString() === cloneDay.toDateString()
            );

            days.push(
                <div
                    key={day.toISOString()}
                    onClick={() => onDateClick(cloneDay)}
                    className={`
                        min-h-[180px] p-2 border-r border-b border-gray-100 relative group transition-all
                        bg-white hover:bg-gray-50 cursor-pointer
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`
                            text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                            ${isToday(day) ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-gray-700'}
                        `}>
                            {formattedDate}
                        </span>
                    </div>

                    <div className="space-y-1">
                        {dayEvents.map((evt, idx) => (
                            <div
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(evt); }}
                                className={`
                                    flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium cursor-pointer truncate transition-all hover:opacity-90
                                    ${evt.color || 'bg-blue-100 text-blue-700'}
                                `}
                                title={evt.title}
                            >
                                <div className={`min-w-[12px] h-[12px] rounded-[3px] border border-current opacity-60 flex items-center justify-center`}>
                                    <svg className="w-2 h-2 opacity-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="truncate">{evt.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        return days;
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>
            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-7 h-1/2">
                    {renderWeek(startOfFirstWeek, endOfFirstWeek)}
                </div>
                <div className="grid grid-cols-7 h-1/2">
                    {renderWeek(startOfSecondWeek, endOfSecondWeek)}
                </div>
            </div>
        </div>
    );
};

export default MultiWeekView;
