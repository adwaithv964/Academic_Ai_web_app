import React, { useState, useEffect } from 'react';
import { tasks as tasksApi, sessions as sessionsApi, courses as coursesApi } from '../../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import CalendarGrid from './components/CalendarGrid';
import TaskList from './components/TaskList';
import ViewControls from './components/ViewControls';
import SessionModal from './components/SessionModal';
import StudyStats from './components/StudyStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudyPlanner = () => {
  const [currentView, setCurrentView] = useState('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');

  // Study sessions data with persistence
  const [studySessions, setStudySessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loadedSessions, loadedTasks, loadedCourses] = await Promise.all([
          sessionsApi.list(),
          tasksApi.list(),
          coursesApi.list()
        ]);
        setStudySessions(loadedSessions);
        setTasks(loadedTasks);
        setCourses(loadedCourses);
      } catch (error) {
        console.error("Failed to load planner data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const handleSessionCreated = () => fetchData();
    window.addEventListener('session-created', handleSessionCreated);

    return () => {
      window.removeEventListener('session-created', handleSessionCreated);
    };
  }, []);

  // Tasks are now managed via API state above

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setSelectedTimeSlot(null);
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (day, hour) => {
    setSelectedSession(null);
    setSelectedTimeSlot({ day, hour });
    setIsModalOpen(true);
  };

  const handleSessionSave = async (sessionData) => {
    try {
      if (selectedSession && selectedSession._id) {
        // Update existing session
        const updated = await sessionsApi.update(selectedSession._id, sessionData);
        setStudySessions(prev =>
          prev.map(session =>
            session._id === selectedSession._id ? updated : session
          )
        );
      } else {
        // Add new session
        const created = await sessionsApi.create(sessionData);
        setStudySessions(prev => [...prev, created]);
      }
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleCourseCreate = async (courseName) => {
    try {
      // Predefined safe Tailwind color combinations
      const palette = [
        'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-100',
        'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-100',
        'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-100',
        'bg-lime-100 border-lime-200 text-lime-800 dark:bg-lime-900/30 dark:border-lime-700 dark:text-lime-100',
        'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-100',
        'bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-100',
        'bg-teal-100 border-teal-200 text-teal-800 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-100',
        'bg-cyan-100 border-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-100',
        'bg-sky-100 border-sky-200 text-sky-800 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-100',
        'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-100',
        'bg-indigo-100 border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-100',
        'bg-violet-100 border-violet-200 text-violet-800 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-100',
        'bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-100',
        'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:border-fuchsia-700 dark:text-fuchsia-100',
        'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-100',
        'bg-rose-100 border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-100'
      ];

      const color = palette[Math.floor(Math.random() * palette.length)];

      const newCourse = await coursesApi.create({
        name: courseName,
        color: color
      });
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (error) {
      console.error("Failed to create course:", error);
      throw error;
    }
  };

  const handleSessionDelete = async (sessionId) => {
    try {
      await sessionsApi.delete(sessionId);
      setStudySessions(prev => prev.filter(session => session._id !== sessionId));
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleSessionDrop = (session, day, hour) => {
    const updatedSession = {
      ...session,
      startTime: `${hour?.toString()?.padStart(2, '0')}:00`,
      updatedAt: new Date()?.toISOString()
    };

    setStudySessions(prev =>
      prev?.map(s => s?.id === session?.id ? updatedSession : s)
    );
  };

  const handleSessionResize = (session, newDuration) => {
    const updatedSession = {
      ...session,
      duration: newDuration,
      updatedAt: new Date()?.toISOString()
    };

    setStudySessions(prev =>
      prev?.map(s => s?.id === session?.id ? updatedSession : s)
    );
  };

  const handleTaskToggle = async (taskId, completed) => {
    try {
      await tasksApi.update(taskId, { completed });
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, completed } : task
        )
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleTaskAdd = async (taskData) => {
    try {
      // Remove temporary ID if present
      const { id, ...data } = taskData;
      const created = await tasksApi.create(data);
      setTasks(prev => [...prev, created]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updated = await tasksApi.update(taskId, updates);
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? updated : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await tasksApi.delete(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Study Schedule', 14, 22);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Date", "Time", "Subject", "Topic", "Duration (h)", "Priority", "Location"];
    const tableRows = [];

    // Sort sessions by date and time
    const sortedSessions = [...studySessions].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateA - dateB;
    });

    sortedSessions.forEach(session => {
      const sessionData = [
        new Date(session.date || session.createdAt).toLocaleDateString(),
        session.startTime,
        session.subject,
        session.topic,
        session.duration,
        session.priority,
        session.location || '-'
      ];
      tableRows.push(sessionData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [63, 81, 181] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`Study_Schedule_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const tabs = [
    { key: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { key: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { key: 'stats', label: 'Statistics', icon: 'BarChart3' }
  ];

  return (
    <>
      <Helmet>
        <title>Study Planner - Academic Result Predictor</title>
        <meta name="description" content="Plan and organize your study sessions with interactive calendar and task management tools" />
      </Helmet>
      <div className="h-full">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground">Study Planner</h1>
              <p className="text-muted-foreground">
                Organize your study sessions and track academic tasks
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="Download"
                className="hidden sm:flex"
                onClick={handleExport}
              >
                Export Schedule
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                onClick={() => {
                  setSelectedSession(null);
                  setSelectedTimeSlot(null);
                  setIsModalOpen(true);
                }}
              >
                New Session
              </Button>
            </div>
          </motion.div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
              {tabs?.map((tab) => (
                <button
                  key={tab?.key}
                  onClick={() => setActiveTab(tab?.key)}
                  className={`
                      flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-academic flex-1 justify-center
                      ${activeTab === tab?.key
                      ? 'text-primary bg-card shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                    }
                    `}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2 space-y-6">
              <ViewControls
                currentView={currentView}
                onViewChange={setCurrentView}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onTodayClick={handleTodayClick}
              />

              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CalendarGrid
                  currentView={currentView}
                  currentDate={currentDate}
                  studySessions={studySessions}
                  courses={courses}
                  onSessionClick={handleSessionClick}
                  onTimeSlotClick={handleTimeSlotClick}
                  onSessionDrop={handleSessionDrop}
                  onSessionResize={handleSessionResize}
                />
              </motion.div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <TaskList
                tasks={tasks}
                courses={courses}
                onTaskToggle={handleTaskToggle}
                onTaskAdd={handleTaskAdd}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />

              <StudyStats
                studySessions={studySessions}
                tasks={tasks}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {activeTab === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <ViewControls
                  currentView={currentView}
                  onViewChange={setCurrentView}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  onTodayClick={handleTodayClick}
                />

                <CalendarGrid
                  currentView={currentView}
                  currentDate={currentDate}
                  studySessions={studySessions}
                  courses={courses}
                  onSessionClick={handleSessionClick}
                  onTimeSlotClick={handleTimeSlotClick}
                  onSessionDrop={handleSessionDrop}
                  onSessionResize={handleSessionResize}
                />
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TaskList
                  tasks={tasks}
                  courses={courses}
                  onTaskToggle={handleTaskToggle}
                  onTaskAdd={handleTaskAdd}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StudyStats
                  studySessions={studySessions}
                  tasks={tasks}
                />
              </motion.div>
            )}
          </div>

          {/* Quick Actions Floating Button - Mobile */}
          <div className="fixed bottom-20 right-4 lg:hidden z-100">
            <Button
              variant="default"
              size="icon"
              iconName="Plus"
              onClick={() => {
                setSelectedSession(null);
                setSelectedTimeSlot(null);
                setIsModalOpen(true);
              }}
              className="h-14 w-14 rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* Session Modal */}
        <SessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          session={selectedSession}
          selectedDay={selectedTimeSlot?.day}
          selectedHour={selectedTimeSlot?.hour}
          onSave={handleSessionSave}
          onDelete={handleSessionDelete}
          courses={courses}
          onCourseCreate={handleCourseCreate}
        />
      </div>
    </>
  );
};

export default StudyPlanner;