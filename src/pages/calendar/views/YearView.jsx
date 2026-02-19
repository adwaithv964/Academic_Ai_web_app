import React from 'react';
import {
    format,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isToday
} from 'date-fns';

const YearView = ({ currentDate, events, onMonthClick }) => {
    const months = eachMonthOfInterval({
        start: startOfYear(currentDate),
        end: endOfYear(currentDate)
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 overflow-y-auto h-full pb-24">
            {months.map(month => (
                <div
                    key={month.toString()}
                    className="cursor-pointer hover:bg-gray-50 p-4 rounded-xl transition-colors"
                    onClick={() => onMonthClick(month)}
                >
                    <h3 className="font-bold text-gray-900 mb-4">{format(month, 'MMMM')}</h3>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-xs text-gray-400 font-medium mb-1">{d.charAt(0)}</div>
                        ))}

                        {eachDayOfInterval({
                            start: startOfMonth(month),
                            end: endOfMonth(month)
                        }).map((day, idx) => {
                            
                            const style = idx === 0 ? { gridColumnStart: day.getDay() + 1 } : {};
                            const hasEvent = events.some(e =>
                                e.date.getDate() === day.getDate() &&
                                e.date.getMonth() === day.getMonth() &&
                                e.date.getFullYear() === day.getFullYear()
                            );

                            return (
                                <div
                                    key={day.toString()}
                                    style={style}
                                    className={`
                                        text-xs h-6 w-6 flex items-center justify-center rounded-full mx-auto
                                        ${isToday(day) ? 'bg-primary text-white font-bold' : hasEvent ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'}
                                    `}
                                >
                                    {format(day, 'd')}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default YearView;
