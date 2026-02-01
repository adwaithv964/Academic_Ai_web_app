import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useNotifications } from '../../hooks/useNotifications';
import { useDateFormatter } from '../../hooks/useDateFormatter';
import { sessions as sessionsApi } from '../../services/api';

const Header = ({ sidebarCollapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const { formatDate } = useDateFormatter();

  // Timer State (Mock for Global Header)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getBreadcrumbs = () => {
    // Mock breadcrumb logic based on design: "Date - Week - Context"
    const today = new Date();
    const dateStr = today.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }); // 04.10.24 style
    const weekNumber = Math.ceil((today.getDate() - 1 + new Date(today.getFullYear(), 0, 1).getDay()) / 7);

    return (
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="font-bold text-primary">{dateStr}</span>
        <span>•</span>
        <span>WEEK {weekNumber}</span>
        <span>•</span>
        <span className="uppercase tracking-wider">{location.pathname === '/' ? 'DASHBOARD' : location.pathname.substring(1).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <header className={`
      fixed top-0 right-0 h-16 z-50 transition-all duration-300
      bg-background/80 backdrop-blur-md border-b border-border
      ${sidebarCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'}
    `}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Breadcrumbs */}
        <div className="hidden md:block">
          {getBreadcrumbs()}
          <h1 className="text-lg font-bold text-foreground mt-0.5">
            {location.pathname === '/' ? 'Dashboard' :
              location.pathname.split('/')[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h1>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden">
          <span className="font-bold text-foreground">StudyMate</span>
        </div>

        {/* Right Section - Timer & Actions */}
        <div className="flex items-center gap-4">
          {/* Timer Widget */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full pl-4 pr-1 py-1">
            <span className="font-mono text-sm text-white">{formatTimer(time)}</span>
            <button
              onClick={async () => {
                if (isTimerRunning) {
                  // Stop Timer
                  setIsTimerRunning(false);

                  // Save Session if significant time elapsed (> 1 min)
                  if (time > 60) {
                    try {
                      const now = new Date();
                      const startTime = new Date(now.getTime() - time * 1000);

                      await sessionsApi.create({
                        subject: 'Uncategorized',
                        topic: 'Timed Session',
                        startTime: startTime?.toTimeString()?.substring(0, 5),
                        duration: Number((time / 3600).toFixed(2)),
                        date: now.toISOString(),
                        type: 'study',
                        priority: 'medium',
                        notes: `Auto-saved session: ${formatTimer(time)}`
                      });

                      // Optional: Trigger a refresh or notify
                      console.log('Session saved from timer');
                      window.dispatchEvent(new CustomEvent('session-created'));
                    } catch (error) {
                      console.error('Failed to save timer session:', error);
                    }
                  }

                  setTime(0);
                } else {
                  setIsTimerRunning(true);
                }
              }}
              className={`
                        h-7 px-3 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all
                        ${isTimerRunning ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-primary/20 text-primary hover:bg-primary/30'}
                    `}
            >
              <Icon name={isTimerRunning ? "Square" : "Play"} size={12} fill="currentColor" />
              {isTimerRunning ? 'Stop' : 'Start'}
            </button>
          </div>

          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Quick Actions */}
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            onClick={() => navigate('/study-planner')}
            className="hidden sm:flex"
          >
            Session
          </Button>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            <Icon name="Bell" size={20} />
            {unreadCount > 0 && (
              <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
            )}
          </button>

          {/* Avatar / Profile */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-fuchsia-500 ring-2 ring-background cursor-pointer"
            onClick={() => navigate('/student-profile-settings')}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;