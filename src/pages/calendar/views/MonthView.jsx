import React from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
    isToday
} from 'date-fns';

const MonthView = ({ currentDate, events, onDateClick, onEventClick, onEventComplete }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
            const dayEvents = events.filter(e => isSameDay(e.date, cloneDay));

            days.push(
                <div
                    key={day.toISOString()}
                    onClick={() => onDateClick(cloneDay)}
                    className={`
                        min-h-[120px] p-2 border-r border-b border-gray-100 relative group transition-all
                        ${!isSameMonth(day, monthStart) ? 'bg-gray-50/30 text-gray-300' : 'bg-white'}
                        hover:bg-gray-50 cursor-pointer
                    `}
                >
                    <div className="flex justify-between items-start mb-1">
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
                                    flex items-center gap-2 w-[95%] mx-auto mb-1 px-2 py-1.5 rounded-[6px] text-xs font-semibold cursor-pointer truncate transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 text-[#333] group/evt
                                    ${evt.color && evt.color.startsWith('bg-') ? evt.color : ''}
                                    ${evt.isCompleted ? 'opacity-60 grayscale-[50%]' : ''}
                                `}
                                style={evt.color && !evt.color.startsWith('bg-') ? { backgroundColor: evt.color } : {}}
                                title={`${evt.title} ${evt.time ? '- ' + evt.time : ''}`}
                            >
                                <div
                                    className={`
                                        min-w-[14px] h-[14px] rounded-[4px] border border-[#333]/40 flex items-center justify-center flex-shrink-0 transition-colors
                                        ${evt.isCompleted ? 'bg-green-500 border-green-600 text-white' : 'hover:bg-white/50'}
                                    `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onEventComplete && evt.type === 'generic') onEventComplete(evt);
                                    }}
                                >
                                    {evt.isCompleted ? (
                                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : (
                                        <div className="w-full h-full opacity-0 group-hover/evt:opacity-100 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#333]/20" />
                                        </div>
                                    )}
                                </div>
                                <span className={`truncate flex-1 text-left ${evt.isCompleted ? 'line-through decoration-current' : ''}`}>
                                    {evt.title}
                                </span>
                                {evt.time && <span className="text-[10px] font-medium opacity-60 flex-shrink-0">{evt.time}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="grid grid-cols-7" key={day.toISOString()}>
                {days}
            </div>
        );
        days = [];
    }

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
                {rows}
            </div>
        </div>
    );
};

export default MonthView;
