import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../AppIcon';
import Button from './Button';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useDateFormatter } from '../../hooks/useDateFormatter';
import { sessions as sessionsApi } from '../../services/api';
import { startTimer, pauseTimer, tick, resetTimer } from '../../store/slices/focusSlice';
import { useAuth } from '../../contexts/AuthContext';
import { NOTIF_TYPES } from '../../hooks/useNotifications';

// ─── Notification type badge ──────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const cfg = NOTIF_TYPES[type] || NOTIF_TYPES.GENERAL;
  return (
    <span
      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base"
      style={{ background: cfg.color + '22', border: `1.5px solid ${cfg.color}44` }}
      title={cfg.label}
    >
      {cfg.icon}
    </span>
  );
};

// ─── Relative time ────────────────────────────────────────────────────────────
const relTime = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'all',       label: 'All'       },
  { id: 'unread',    label: 'Unread'    },
  { id: 'tasks',     label: 'Tasks'     },
  { id: 'exams',     label: 'Exams'     },
  { id: 'reminders', label: 'Reminders' },
];

const Header = ({ sidebarCollapsed = false }) => {
  const { currentUser, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [now, setNow] = useState(Date.now());

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    dismissNotification,
    snoozeNotification,
    addNotification,
  } = useNotificationContext();

  const { formatDate } = useDateFormatter();
  const userProfile = currentUser;
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const { isActive, timeLeft, mode, initialDuration } = useSelector(state => state.focus);

  // Refresh relative times every 30s
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // ─── 5-minute timer warning ──────────────────────────────────────────────
  const fiveMinFiredRef = useRef(false);
  useEffect(() => {
    if (isActive && timeLeft === 300 && !fiveMinFiredRef.current) {
      fiveMinFiredRef.current = true;
      addNotification({
        id: `timer-5min-warn-${Date.now()}`,
        type: 'TIMER',
        title: '⏱️ 5 Minutes Left!',
        message: `Focus session ending in 5 minutes. Start wrapping up!`,
        timestamp: Date.now(),
        unread: true,
      });
    }
    if (!isActive) fiveMinFiredRef.current = false;
  }, [isActive, timeLeft, addNotification]);

  // ─── Timer tick + session save ────────────────────────────────────────────
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => dispatch(tick()), 1000);
    } else if (timeLeft === 0 && isActive) {
      dispatch(pauseTimer());

      const saveCompletedSession = async () => {
        try {
          const n = new Date();
          await sessionsApi.create({
            subject: 'Focus Session',
            topic: mode === 'focus' ? 'Deep Work' : 'Break',
            startTime: new Date(n.getTime() - initialDuration * 1000).toTimeString().substring(0, 5),
            duration: Number((initialDuration / 3600).toFixed(2)),
            date: n.toISOString(),
            type: 'study',
            priority: 'medium',
            notes: `Completed ${mode}: ${formatTimer(initialDuration)}`
          });
          addNotification({
            id: `timer-complete-${Date.now()}`,
            type: 'TIMER',
            title: '✅ Focus Session Complete!',
            message: `Excellent work! Recorded ${formatTimer(initialDuration)} of ${mode === 'focus' ? 'deep focus' : 'break'} time.`,
            timestamp: Date.now(),
            unread: true,
          });
          if (refreshUser) await refreshUser();
        } catch (error) {
          console.error('Failed to save completed session:', error);
        }
      };
      saveCompletedSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, dispatch, mode, initialDuration]);

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimerToggle = async () => {
    if (isActive) {
      dispatch(pauseTimer());
      const elapsed = initialDuration - timeLeft;
      if (elapsed > 60) {
        try {
          const n = new Date();
          await sessionsApi.create({
            subject: 'Focus Session',
            topic: mode === 'focus' ? 'Deep Work' : 'Break',
            startTime: new Date(n.getTime() - elapsed * 1000).toTimeString().substring(0, 5),
            duration: Number((elapsed / 3600).toFixed(2)),
            date: n.toISOString(),
            type: 'study',
            priority: 'medium',
            notes: `Auto-saved ${mode}: ${formatTimer(elapsed)}`
          });
          addNotification({
            id: `timer-saved-${Date.now()}`,
            type: 'TIMER',
            title: '💾 Session Saved',
            message: `Progress saved: ${formatTimer(elapsed)} of focus time recorded.`,
            timestamp: Date.now(),
            unread: true,
          });
        } catch (e) {
          console.error('Failed to save session', e);
        }
      }
    } else {
      dispatch(startTimer());
    }
  };

  // ─── Breadcrumbs ─────────────────────────────────────────────────────────
  const getBreadcrumbs = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const weekNumber = Math.ceil((today.getDate() - 1 + new Date(today.getFullYear(), 0, 1).getDay()) / 7);
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="font-bold text-primary">{dateStr}</span>
        <span>•</span>
        <span>WEEK {weekNumber}</span>
        <span>•</span>
        <span className="uppercase tracking-wider">
          {location.pathname === '/' ? 'DASHBOARD' : location.pathname.substring(1).toUpperCase()}
        </span>
      </div>
    );
  };

  // ─── Filter notifications by active tab ───────────────────────────────────
  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return n.unread;
    return n.category === activeTab || n.type?.toLowerCase() === activeTab;
  });

  const tabUnreadCount = (tabId) => {
    if (tabId === 'all') return unreadCount;
    return notifications.filter(n => n.unread && (n.category === tabId || n.type?.toLowerCase() === tabId)).length;
  };

  return (
    <header className={`
      fixed top-0 right-0 h-16 z-50 transition-all duration-300
      bg-background/80 backdrop-blur-md border-b border-border
      ${sidebarCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'}
    `}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
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

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mini Timer Widget */}
          {(isActive || timeLeft !== initialDuration) && (
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full pl-4 pr-1 py-1 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-2 mr-2">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <span className="font-mono text-sm text-white min-w-[3rem]">{formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={handleTimerToggle}
                className={`h-7 px-3 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all
                  ${isActive ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
              >
                <Icon name={isActive ? 'Pause' : 'Play'} size={12} fill="currentColor" />
                {isActive ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={() => dispatch(resetTimer())}
                className="h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all ml-1"
                title="Reset & Close"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}

          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Session Button */}
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            onClick={() => navigate('/study-planner')}
            className="hidden sm:flex"
          >
            Session
          </Button>

          {/* ── Notifications Bell ── */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-background animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-[22rem] sm:w-[26rem] bg-card border border-border shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right flex flex-col"
                style={{ maxHeight: '80vh' }}>

                {/* Header */}
                <div className="px-4 pt-4 pb-2 border-b border-border bg-muted/20 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Bell" size={16} className="text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 overflow-x-auto scrollbar-none">
                    {TABS.map(tab => {
                      const cnt = tabUnreadCount(tab.id);
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0
                            ${activeTab === tab.id
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                          {tab.label}
                          {cnt > 0 && (
                            <span className={`text-[9px] font-bold px-1 py-px rounded-full
                              ${activeTab === tab.id ? 'bg-white/30' : 'bg-primary/20 text-primary'}`}>
                              {cnt}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1">
                  {filteredNotifs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <div className="text-3xl mb-2">🔕</div>
                      <p className="text-sm font-medium">No {activeTab !== 'all' ? activeTab : ''} notifications</p>
                      <p className="text-xs mt-1 opacity-60">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredNotifs.map(notif => {
                        const cfg = NOTIF_TYPES[notif.type] || NOTIF_TYPES.GENERAL;
                        return (
                          <div
                            key={notif.id}
                            className={`group px-4 py-3 hover:bg-muted/40 transition-colors ${notif.unread ? 'bg-primary/3' : ''}`}
                            style={notif.unread ? { borderLeft: `3px solid ${cfg.color}` } : { borderLeft: '3px solid transparent' }}
                          >
                            <div className="flex gap-3">
                              <TypeBadge type={notif.type} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p
                                    className={`text-xs font-medium leading-snug cursor-pointer ${notif.unread ? 'text-foreground' : 'text-muted-foreground'}`}
                                    onClick={() => markAsRead(notif.id)}
                                  >
                                    {notif.title}
                                  </p>
                                  <span className="text-[9px] text-muted-foreground whitespace-nowrap flex-shrink-0 mt-0.5">
                                    {relTime(notif.timestamp)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                  {notif.message}
                                </p>
                                {/* Action buttons */}
                                <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {notif.unread && (
                                    <button
                                      onClick={() => markAsRead(notif.id)}
                                      className="text-[10px] text-primary hover:underline"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => snoozeNotification(notif.id, 15)}
                                    className="text-[10px] text-muted-foreground hover:text-foreground"
                                    title="Snooze 15 minutes"
                                  >
                                    ⏰ Snooze 15m
                                  </button>
                                  <button
                                    onClick={() => dismissNotification(notif.id)}
                                    className="text-[10px] text-muted-foreground hover:text-destructive"
                                    title="Dismiss"
                                  >
                                    ✕ Dismiss
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-border bg-muted/10 flex-shrink-0 text-center">
                    <span className="text-[10px] text-muted-foreground">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''} total · Auto-refreshes every 60s
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar / Profile */}
          <div
            className="relative"
            onMouseEnter={() => setShowProfileTooltip(true)}
            onMouseLeave={() => setShowProfileTooltip(false)}
          >
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-fuchsia-500 ring-2 ring-background cursor-pointer flex items-center justify-center text-white font-semibold text-sm hover:ring-primary/50 transition-all"
              onClick={() => navigate('/student-profile-settings')}
              title="View Profile Settings"
            >
              {userProfile
                ? `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase()
                : '?'}
            </div>
            {showProfileTooltip && userProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-card border border-border shadow-lg rounded-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                    {`${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{userProfile.firstName} {userProfile.lastName}</p>
                    <p className="text-xs text-muted-foreground">{userProfile.studentId || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 border-t border-border pt-3">
                  <p>{userProfile.major || 'N/A'} • Class of {userProfile.graduationYear || 'N/A'}</p>
                  <p className="text-[10px] text-primary hover:underline cursor-pointer" onClick={() => navigate('/student-profile-settings')}>
                    View Profile Settings →
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
      )}
    </header>
  );
};

export default Header;