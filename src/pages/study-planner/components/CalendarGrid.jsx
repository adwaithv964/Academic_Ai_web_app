import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { CheckCircle, Circle } from 'lucide-react';
import { useDateFormatter } from '../../../hooks/useDateFormatter';


const CalendarGrid = ({
  currentView,
  currentDate,
  studySessions,
  onSessionClick,
  onSessionComplete,
  onTimeSlotClick,
  onSessionDrop,
  onSessionResize,
  courses = []
}) => {
  const [draggedSession, setDraggedSession] = useState(null);
  const [resizingSession, setResizingSession] = useState(null);
  const { formatDate } = useDateFormatter();

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
      time: `${hour?.toString()?.padStart(2, '0')}:00`,
      hour: hour
    };
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getSessionsForTimeSlot = (day, hour) => {
    return studySessions?.filter(session => {
      const sessionDay = new Date(session.date)?.getDay();
      const sessionHour = parseInt(session?.startTime?.split(':')?.[0]);
      const dayIndex = weekDays?.indexOf(day);
      const adjustedSessionDay = sessionDay === 0 ? 6 : sessionDay - 1;

      return adjustedSessionDay === dayIndex && sessionHour === hour;
    });
  };

  const handleDragStart = (e, session) => {
    setDraggedSession(session);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, day, hour) => {
    e?.preventDefault();
    if (draggedSession) {
      onSessionDrop(draggedSession, day, hour);
      setDraggedSession(null);
    }
  };

  const handleResizeStart = (session) => {
    setResizingSession(session);
  };

  const handleResizeEnd = (session, newDuration) => {
    onSessionResize(session, newDuration);
    setResizingSession(null);
  };

  const getStickyNoteStyle = (subject, courseColor, isCompleted) => {

    const getStyle = (colorName) => {

      if (colorName === 'red') colorName = 'rose';
      const baseStyle = `bg-${colorName}-100 border-2 border-${colorName}-200 text-${colorName}-800 shadow-sm hover:shadow-md dark:bg-${colorName}-900/30 dark:border-${colorName}-700 dark:text-${colorName}-100`;
      return isCompleted ? `${baseStyle} opacity-60 grayscale-[50%]` : baseStyle;
    };


    if (courseColor) {
      const match = courseColor.match(/bg-(\w+)-/);
      if (match && match[1]) {
        return getStyle(match[1]);
      }
    }


    const subjectColors = {
      'Mathematics': 'blue',
      'Physics': 'emerald',
      'Chemistry': 'violet',
      'Biology': 'orange',
      'English': 'pink',
      'History': 'amber',
      'Computer Science': 'indigo',
      'Geography': 'cyan',
      'Art': 'fuchsia',
      'Music': 'rose',

      'red': 'rose'
    };


    if (!subjectColors[subject]) {
      const fallbacks = ['yellow', 'lime', 'green', 'teal', 'sky', 'purple'];

      const hash = subject?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
      return getStyle(fallbacks[hash % fallbacks.length]);
    }

    let color = subjectColors[subject];

    if (color === 'red') color = 'rose';

    return getStyle(color);
  };

  const getSubjectColor = (subject, isCompleted) => {
    const course = courses.find(c => c.name === subject);
    return getStickyNoteStyle(subject, course?.color, isCompleted);
  };

  const handleCompleteClick = (e, session) => {
    e.stopPropagation();
    if (onSessionComplete) {
      onSessionComplete(session);
    }
  };

  if (currentView === 'daily') {
    const currentDayName = weekDays?.[new Date(currentDate)?.getDay() === 0 ? 6 : new Date(currentDate)?.getDay() - 1];

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{currentDayName} Schedule</h3>
          <p className="text-sm text-muted-foreground">{formatDate(currentDate)}</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {timeSlots?.map((slot) => {
            const sessions = getSessionsForTimeSlot(currentDayName, slot?.hour);
            return (
              <div
                key={slot?.hour}
                className="flex border-b border-border hover:bg-muted/30 transition-academic"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, currentDayName, slot?.hour)}
              >
                <div className="w-20 p-3 text-sm text-muted-foreground border-r border-border">
                  {slot?.time}
                </div>
                <div className="flex-1 p-2 min-h-[60px]">
                  {sessions?.length === 0 ? (
                    <button
                      onClick={() => onTimeSlotClick(currentDayName, slot?.hour)}
                      className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-academic"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  ) : (
                    sessions?.map((session, index) => (
                      <motion.div
                        key={session?._id || session?.id || index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, session)}
                        onClick={() => onSessionClick(session)}
                        className={`
                          p-3 rounded-lg cursor-pointer mb-2 last:mb-0 relative group
                          ${getSubjectColor(session?.subject, session?.isCompleted)}
                          transition-all duration-200
                        `}
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={(e) => handleCompleteClick(e, session)}
                          className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${session.isCompleted ? 'text-green-600 bg-white/50' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-green-600 hover:bg-white/50'}`}
                          title={session.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {session.isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                        </button>

                        <div className="flex items-center justify-between pr-6">
                          <div>
                            <p className={`font-medium text-sm ${session.isCompleted ? 'line-through decoration-current' : ''}`}>{session?.subject}</p>
                            <p className="text-xs opacity-80">{session?.topic}</p>
                          </div>
                          <div className="text-xs opacity-60">
                            {session?.duration}h
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0); // normalize to local midnight
    return d;
  };

  // Format a Date as local YYYY-MM-DD string (no UTC shift)
  const toLocalDateStr = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

  const getSessionsForDate = (date) => {
    return studySessions?.filter(session => isSameDate(session.date, date));
  };

  if (currentView === 'monthly') {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalDays = lastDay.getDate();

    const days = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, type: 'prev', date: new Date(year, month - 1, prevMonthLastDay - i) });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, type: 'current', date: new Date(year, month, i) });
    }

    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, type: 'next', date: new Date(year, month + 1, i) });
    }

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-sm font-medium text-foreground text-center border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {days.map((dayObj, index) => {
            const sessions = getSessionsForDate(dayObj.date);
            const isToday = isSameDate(dayObj.date, new Date());

            return (
              <div
                key={index}
                className={`
                    p-2 border-b border-r border-border hover:bg-muted/20 transition-colors relative
                    ${dayObj.type !== 'current' ? 'bg-muted/10 text-muted-foreground' : ''}
                    ${index % 7 === 6 ? 'border-r-0' : ''}
                `}
                onClick={() => {

                  onTimeSlotClick(weekDays[dayObj.date.getDay() === 0 ? 6 : dayObj.date.getDay() - 1], 9);
                }}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                  {dayObj.day}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {sessions?.map(session => (
                    <div
                      key={session._id}
                      onClick={(e) => { e.stopPropagation(); onSessionClick(session); }}
                      className={`
                                text-[10px] p-1 rounded truncate flex items-center gap-1 cursor-pointer
                                ${getSubjectColor(session.subject, session.isCompleted)}
                            `}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${session.isCompleted ? 'bg-green-500' : 'bg-current opacity-50'}`}
                      />
                      <span className={session.isCompleted ? 'line-through opacity-70' : ''}>
                        {session.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }



  const startOfCurrentWeek = getStartOfWeek(currentDate);

  const getSessionsForWeekSlot = (dayName, hour) => {
    return studySessions?.filter(session => {
      if (!session.date) return false;

      const sessionHour = parseInt(session?.startTime?.split(':')?.[0]);
      if (sessionHour !== hour) return false;

      // Build the local date string for this slot's day in the current week
      const dayIndex = weekDays.indexOf(dayName);
      const slotDate = new Date(startOfCurrentWeek);
      slotDate.setDate(startOfCurrentWeek.getDate() + dayIndex);
      const slotDateStr = toLocalDateStr(slotDate);

      // Parse session.date tolerantly — handles both 'YYYY-MM-DD' and ISO strings
      const sessionDateStr = session.date.length === 10
        ? session.date // already 'YYYY-MM-DD'
        : toLocalDateStr(new Date(session.date)); // convert ISO to local date str

      return sessionDateStr === slotDateStr;
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 text-sm font-medium text-muted-foreground border-r border-border sticky left-0 bg-card z-10">
            Time
          </div>
          {weekDays?.map((day, index) => {
            const date = new Date(startOfCurrentWeek);
            date.setDate(date.getDate() + index);
            const isToday = isSameDate(date, new Date());

            return (
              <div key={day} className={`p-3 text-sm text-foreground border-r border-border last:border-r-0 flex flex-col items-center ${isToday ? 'bg-primary/5' : ''}`}>
                <span className="font-medium">{day}</span>
                <span className={`text-xs mt-1 ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {timeSlots?.map((slot) => (
            <div key={slot?.hour} className="grid grid-cols-8 border-b border-border hover:bg-muted/20 transition-academic">
              <div className="p-3 text-sm text-muted-foreground border-r border-border sticky left-0 bg-card z-10">
                {slot?.time}
              </div>
              {weekDays?.map((day) => {
                const sessions = getSessionsForWeekSlot(day, slot?.hour);
                return (
                  <div
                    key={`${day}-${slot?.hour}`}
                    className="p-1 border-r border-border last:border-r-0 min-h-[60px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, slot?.hour)}
                  >
                    {sessions?.length === 0 ? (
                      <button
                        onClick={() => onTimeSlotClick(day, slot?.hour)}
                        className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-academic"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    ) : (
                      sessions?.map((session, index) => (
                        <motion.div
                          key={session?._id || session?.id || index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, session)}
                          onClick={() => onSessionClick(session)}
                          className={`
                          p-1.5 rounded-md text-xs cursor-pointer mb-1 last:mb-0 relative group
                          ${getSubjectColor(session?.subject, session?.isCompleted)}
                          transition-all duration-200
                        `}
                          whileHover={{ scale: 1.05, rotate: 1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={(e) => handleCompleteClick(e, session)}
                            className={`absolute top-1 right-1 p-0.5 rounded-full transition-colors ${session.isCompleted ? 'text-green-600 bg-white/50' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-green-600 hover:bg-white/50'}`}
                            title={session.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {session.isCompleted ? <CheckCircle size={12} /> : <Circle size={12} />}
                          </button>

                          <div className="pr-4">
                            <p className={`font-medium truncate ${session.isCompleted ? 'line-through decoration-current' : ''}`}>{session?.subject}</p>
                            <p className="opacity-80 truncate">{session?.topic}</p>
                            <p className="opacity-60">{session?.duration}h</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;