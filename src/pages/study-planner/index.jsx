import React, { useState, useEffect } from 'react';
import { tasks as tasksApi, sessions as sessionsApi } from '../../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import CalendarGrid from './components/CalendarGrid';
import TaskList from './components/TaskList';
import ViewControls from './components/ViewControls';
import SessionModal from './components/SessionModal';
import StudyStats from './components/StudyStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loadedSessions, loadedTasks] = await Promise.all([
          sessionsApi.list(),
          tasksApi.list()
        ]);
        setStudySessions(loadedSessions);
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Failed to load planner data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  const handleTaskEdit = (task) => {
    // Implementation for task editing would go here
    console.log('Edit task:', task);
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
                onTaskToggle={handleTaskToggle}
                onTaskAdd={handleTaskAdd}
                onTaskEdit={handleTaskEdit}
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
        />
      </div>
    </>
  );
};

export default StudyPlanner;