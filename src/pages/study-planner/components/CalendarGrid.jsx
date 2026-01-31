import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { useDateFormatter } from '../../../hooks/useDateFormatter';


const CalendarGrid = ({
  currentView,
  currentDate,
  studySessions,
  onSessionClick,
  onTimeSlotClick,
  onSessionDrop,
  onSessionResize
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
      const adjustedSessionDay = sessionDay === 0 ? 6 : sessionDay - 1; // Convert Sunday=0 to Sunday=6

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

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
      'Physics': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      'Chemistry': 'bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-300',
      'Biology': 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300',
      'English': 'bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300',
      'History': 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
      'Computer Science': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
    };
    return colors?.[subject] || 'bg-muted border-border text-foreground';
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
                    sessions?.map((session) => (
                      <motion.div
                        key={session?.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, session)}
                        onClick={() => onSessionClick(session)}
                        className={`
                          p-2 rounded border-l-4 cursor-pointer mb-1 last:mb-0
                          ${getSubjectColor(session?.subject)}
                          hover:shadow-sm transition-academic
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{session?.subject}</p>
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

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 text-sm font-medium text-muted-foreground border-r border-border sticky left-0 bg-card z-10">
            Time
          </div>
          {weekDays?.map((day) => (
            <div key={day} className="p-3 text-sm font-medium text-foreground border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {timeSlots?.map((slot) => (
            <div key={slot?.hour} className="grid grid-cols-8 border-b border-border hover:bg-muted/20 transition-academic">
              <div className="p-3 text-sm text-muted-foreground border-r border-border sticky left-0 bg-card z-10">
                {slot?.time}
              </div>
              {weekDays?.map((day) => {
                const sessions = getSessionsForTimeSlot(day, slot?.hour);
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
                      sessions?.map((session) => (
                        <motion.div
                          key={session?.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, session)}
                          onClick={() => onSessionClick(session)}
                          className={`
                          p-1 rounded text-xs cursor-pointer mb-1 last:mb-0 border-l-2
                          ${getSubjectColor(session?.subject)}
                          hover:shadow-sm transition-academic
                        `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <p className="font-medium truncate">{session?.subject}</p>
                          <p className="opacity-80 truncate">{session?.topic}</p>
                          <p className="opacity-60">{session?.duration}h</p>
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