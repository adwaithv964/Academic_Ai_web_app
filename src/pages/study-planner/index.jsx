import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import CalendarGrid from './components/CalendarGrid';
import TaskList from './components/TaskList';
import ViewControls from './components/ViewControls';
import SessionModal from './components/SessionModal';
import StudyStats from './components/StudyStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const StudyPlanner = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');

  // Mock study sessions data
  const [studySessions, setStudySessions] = useState([
    {
      id: 1,
      subject: "Mathematics",
      topic: "Calculus Integration",
      date: new Date()?.toISOString(),
      startTime: "09:00",
      duration: 2,
      priority: "high",
      type: "study",
      location: "Library Room 201",
      notes: "Focus on integration by parts and substitution methods",
      createdAt: "2025-01-08T10:00:00Z"
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Quantum Mechanics Review",
      date: new Date(Date.now() + 86400000)?.toISOString(),
      startTime: "14:00",
      duration: 1.5,
      priority: "medium",
      type: "review",
      location: "Physics Lab",
      notes: "Review wave functions and probability density",
      createdAt: "2025-01-08T11:00:00Z"
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Organic Chemistry Lab Prep",
      date: new Date(Date.now() + 172800000)?.toISOString(),
      startTime: "10:30",
      duration: 3,
      priority: "high",
      type: "assignment",
      location: "Chemistry Lab B",
      notes: "Prepare for synthesis experiment - review reaction mechanisms",
      createdAt: "2025-01-08T12:00:00Z"
    },
    {
      id: 4,
      subject: "Computer Science",
      topic: "Algorithm Design Project",
      date: new Date(Date.now() + 259200000)?.toISOString(),
      startTime: "16:00",
      duration: 2.5,
      priority: "medium",
      type: "project",
      location: "Computer Lab",
      notes: "Work on dynamic programming solutions for optimization problems",
      createdAt: "2025-01-08T13:00:00Z"
    },
    {
      id: 5,
      subject: "Biology",
      topic: "Cell Biology Exam Prep",
      date: new Date(Date.now() + 345600000)?.toISOString(),
      startTime: "11:00",
      duration: 2,
      priority: "high",
      type: "exam",
      location: "Study Room 15",
      notes: "Focus on mitosis, meiosis, and cellular respiration pathways",
      createdAt: "2025-01-08T14:00:00Z"
    }
  ]);

  // Mock tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete Calculus Problem Set 7",
      subject: "Mathematics",
      priority: "high",
      dueDate: "2025-01-12",
      type: "assignment",
      completed: false,
      createdAt: "2025-01-08T09:00:00Z"
    },
    {
      id: 2,
      title: "Read Chapter 12: Quantum States",
      subject: "Physics",
      priority: "medium",
      dueDate: "2025-01-14",
      type: "reading",
      completed: false,
      createdAt: "2025-01-08T10:00:00Z"
    },
    {
      id: 3,
      title: "Lab Report: Organic Synthesis",
      subject: "Chemistry",
      priority: "high",
      dueDate: "2025-01-15",
      type: "lab",
      completed: false,
      createdAt: "2025-01-08T11:00:00Z"
    },
    {
      id: 4,
      title: "Algorithm Analysis Essay",
      subject: "Computer Science",
      priority: "medium",
      dueDate: "2025-01-16",
      type: "assignment",
      completed: true,
      createdAt: "2025-01-07T15:00:00Z"
    },
    {
      id: 5,
      title: "Study Cell Division Diagrams",
      subject: "Biology",
      priority: "low",
      dueDate: "2025-01-18",
      type: "reading",
      completed: true,
      createdAt: "2025-01-07T16:00:00Z"
    },
    {
      id: 6,
      title: "Practice Integration Problems",
      subject: "Mathematics",
      priority: "medium",
      dueDate: "2025-01-13",
      type: "assignment",
      completed: false,
      createdAt: "2025-01-08T12:00:00Z"
    },
    {
      id: 7,
      title: "Prepare Physics Presentation",
      subject: "Physics",
      priority: "high",
      dueDate: "2025-01-11",
      type: "project",
      completed: false,
      createdAt: "2025-01-08T13:00:00Z"
    }
  ]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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

  const handleSessionSave = (sessionData) => {
    if (selectedSession) {
      // Update existing session
      setStudySessions(prev => 
        prev?.map(session => 
          session?.id === selectedSession?.id ? sessionData : session
        )
      );
    } else {
      // Add new session
      setStudySessions(prev => [...prev, sessionData]);
    }
  };

  const handleSessionDelete = (sessionId) => {
    setStudySessions(prev => prev?.filter(session => session?.id !== sessionId));
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

  const handleTaskToggle = (taskId, completed) => {
    setTasks(prev => 
      prev?.map(task => 
        task?.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const handleTaskAdd = (taskData) => {
    setTasks(prev => [...prev, taskData]);
  };

  const handleTaskEdit = (task) => {
    // Implementation for task editing would go here
    console.log('Edit task:', task);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev?.filter(task => task?.id !== taskId));
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
      <div className="min-h-screen bg-background">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle} 
        />
        
        <Header sidebarCollapsed={sidebarCollapsed} />
        
        <main className={`
          transition-academic-slow pt-16 pb-20 lg:pb-6
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
        `}>
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
        </main>

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