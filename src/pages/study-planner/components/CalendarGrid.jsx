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

  const getStickyNoteStyle = (subject, courseColor, isCompleted) => {
    // Helper to generate sticky note classes from a color name
    const getStyle = (colorName) => {
      // Ensure we map red to rose if it comes through here
      if (colorName === 'red') colorName = 'rose';
      const baseStyle = `bg-${colorName}-100 border-2 border-${colorName}-200 text-${colorName}-800 shadow-sm hover:shadow-md dark:bg-${colorName}-900/30 dark:border-${colorName}-700 dark:text-${colorName}-100`;
      return isCompleted ? `${baseStyle} opacity-60 grayscale-[50%]` : baseStyle;
    };

    // 1. Try to extract color from course settings
    if (courseColor) {
      const match = courseColor.match(/bg-(\w+)-/);
      if (match && match[1]) {
        return getStyle(match[1]);
      }
    }

    // 2. Fallback map for common subjects
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
      // Map legacy colors if needed
      'red': 'rose'
    };

    // 3. deterministic fallback for unknown subjects
    if (!subjectColors[subject]) {
      const fallbacks = ['yellow', 'lime', 'green', 'teal', 'sky', 'purple'];
      // Simple hash to pick a color based on subject string length/chars
      const hash = subject?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
      return getStyle(fallbacks[hash % fallbacks.length]);
    }

    let color = subjectColors[subject];
    // specific fix for legacy 'red' which might be missing from new palette safelist
    if (color === 'red') color = 'rose';

    return getStyle(color);
  };

  const getSubjectColor = (subject, isCompleted) => {
    const course = courses.find(c => c.name === subject);
    return getStickyNoteStyle(subject, course?.color, isCompleted);
  };

  const handleCompleteClick = (e, session) => {
    e.stopPropagation(); // Prevent opening modal
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

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden overflow-x-auto">
      <div className="min-w-[600px]">
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