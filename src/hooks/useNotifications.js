import { useState, useEffect, useRef, useCallback } from 'react';
import {
  tasks as tasksApi,
  sessions as sessionsApi,
  exams as examsApi,
  events as eventsApi,
  predictions as predictionsApi,
  gamification as gamificationApi,
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// ─── Storage keys ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'sm_notifications_v3';
const SHOWN_KEY = 'sm_notifications_shown_v3';
const PREFS_KEY = 'sm_notif_prefs_v3';

// ─── Notification type config ──────────────────────────────────────────────────
export const NOTIF_TYPES = {
  TASK:        { icon: '📋', color: '#6366f1', label: 'Task',      category: 'tasks'     },
  EXAM:        { icon: '📝', color: '#ef4444', label: 'Exam',      category: 'exams'     },
  CLASS:       { icon: '🎓', color: '#0ea5e9', label: 'Class',     category: 'reminders' },
  TIMER:       { icon: '⏱️', color: '#f59e0b', label: 'Timer',     category: 'reminders' },
  STREAK:      { icon: '🔥', color: '#f97316', label: 'Streak',    category: 'reminders' },
  REWARD:      { icon: '🏆', color: '#eab308', label: 'Reward',    category: 'reminders' },
  WELLNESS:    { icon: '💆', color: '#22c55e', label: 'Wellness',  category: 'reminders' },
  AI_SCAN:     { icon: '🤖', color: '#8b5cf6', label: 'AI Scan',  category: 'reminders' },
  SETTINGS:    { icon: '⚙️', color: '#64748b', label: 'Settings', category: 'reminders' },
  PLANNER:     { icon: '📅', color: '#06b6d4', label: 'Planner',  category: 'reminders' },
  CALENDAR:    { icon: '📆', color: '#10b981', label: 'Calendar',  category: 'reminders' },
  PREDICTION:  { icon: '🔮', color: '#a855f7', label: 'Predict',  category: 'reminders' },
  ACHIEVEMENT: { icon: '🎖️', color: '#f59e0b', label: 'Achievement', category: 'reminders' },
  GENERAL:     { icon: '🔔', color: '#6b7280', label: 'General',  category: 'all'       },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getShownIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem(SHOWN_KEY) || '[]')); }
  catch { return new Set(); }
};
const addShownId = (id) => {
  try {
    const ids = getShownIds();
    ids.add(id);
    localStorage.setItem(SHOWN_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
};

const loadStored = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const persist = (notifications) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications)); }
  catch { /* ignore */ }
};

const minsUntil = (date) => (new Date(date) - Date.now()) / 60000;

const relativeTime = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

// ─── Browser Notification ─────────────────────────────────────────────────────
let browserPermission = Notification?.permission;

async function requestBrowserPermission() {
  if (!('Notification' in window)) return false;
  if (browserPermission === 'granted') return true;
  if (browserPermission === 'denied') return false;
  browserPermission = await Notification.requestPermission();
  return browserPermission === 'granted';
}

function showBrowserNotif(title, body, icon = '🔔') {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/favicon.ico', badge: '/favicon.ico' });
  } catch { /* ignore */ }
}

// ─── Snooze storage ─────────────────────────────────────────────────────────
const getSnoozed = () => {
  try { return JSON.parse(localStorage.getItem('sm_snoozed_v3') || '{}'); }
  catch { return {}; }
};
const setSnoozed = (snoozed) => {
  try { localStorage.setItem('sm_snoozed_v3', JSON.stringify(snoozed)); }
  catch { /* ignore */ }
};

// ─── Main hook ────────────────────────────────────────────────────────────────
export const useNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState(() => loadStored());
  const snoozedRef = useRef(getSnoozed());
  const timerFiredRef = useRef({}); // track timer-specific events

  // Persist on every change
  const updateNotifications = useCallback((newList) => {
    setNotifications(newList);
    persist(newList);
  }, []);

  // ── Add notification (public API + internal use) ──────────────────────────
  const addNotification = useCallback((notif) => {
    const built = {
      id: notif.id || `manual-${Date.now()}-${Math.random()}`,
      type: notif.type || 'GENERAL',
      title: notif.title,
      message: notif.message,
      timestamp: notif.timestamp || Date.now(),
      unread: true,
      category: notif.category || NOTIF_TYPES[notif.type || 'GENERAL']?.category || 'all',
      ...notif,
    };

    setNotifications(prev => {
      // Avoid duplicates by id
      if (prev.some(n => n.id === built.id)) return prev;
      const updated = [built, ...prev].slice(0, 100); // keep max 100
      persist(updated);
      return updated;
    });

    // browser notif for high-priority types
    const highPriority = ['TASK', 'EXAM', 'TIMER', 'ACHIEVEMENT', 'STREAK', 'REWARD'];
    if (highPriority.includes(built.type)) {
      showBrowserNotif(built.title, built.message);
    }

    // In-app popup toast
    const icon = NOTIF_TYPES[built.type]?.icon || '🔔';
    toast(`${icon} ${built.title}\n${built.message}`, {
      duration: 1000,
      position: 'top-right',
      style: {
        marginTop: '65px', // Clear the fixed header
        background: '#333',
        color: '#fff',
        borderRadius: '8px',
        padding: '8px 12px',
        maxWidth: '280px',
        fontSize: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
    });
  }, []);

  // ── Core generator ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    // Request browser permission on first load
    requestBrowserPermission();

    const prefs = currentUser?.preferences?.notifications || {};

    const generate = async () => {
      try {
        const shownIds = getShownIds();
        const snoozed = snoozedRef.current;
        const now = Date.now();

        // ── Fetch all data in parallel ──────────────────────────────────────
        const [allTasks, allSessions, allExams, allEvents, gamifData] = await Promise.all([
          prefs.deadlineReminders !== false ? tasksApi.list().catch(() => []) : [],
          prefs.studySessionReminders !== false ? sessionsApi.list().catch(() => []) : [],
          prefs.deadlineReminders !== false ? examsApi.list().catch(() => []) : [],
          eventsApi.list().catch(() => []),
          gamificationApi.getStats().catch(() => null),
        ]);

        const toAdd = [];

        const pushIfNew = (id, notif) => {
          // Check snooze
          if (snoozed[id] && snoozed[id] > now) return;
          // Check already shown
          if (shownIds.has(id)) return;
          toAdd.push({ id, ...notif });
          addShownId(id);
        };

        // ── 1. TASKS ───────────────────────────────────────────────────────
        if (Array.isArray(allTasks)) {
          allTasks.forEach(task => {
            if (!task.dueDate || task.completed) return;
            const due = new Date(task.dueDate);
            if (isNaN(due)) return;
            const mins = minsUntil(due);

            const tiers = [
              { key: '7d', threshold: 60 * 24 * 7,  min: 60 * 24 * 6, label: '7 days' },
              { key: '1d', threshold: 60 * 24,        min: 60 * 23,     label: 'tomorrow' },
              { key: '1h', threshold: 60,              min: 30,          label: '1 hour' },
              { key: '15m',threshold: 15,              min: 0,           label: '15 minutes' },
            ];
            tiers.forEach(({ key, threshold, min, label }) => {
              if (mins > 0 && mins <= threshold && mins >= min) {
                pushIfNew(`task-${task._id}-${key}`, {
                  type: 'TASK',
                  title: `Task Due ${label === 'tomorrow' ? 'Tomorrow' : `in ${label}`}`,
                  message: `"${task.title}"${task.subject ? ` (${task.subject})` : ''} is due ${label === 'tomorrow' ? 'tomorrow' : `in ~${label}`}.`,
                  timestamp: now,
                  unread: true,
                  category: 'tasks',
                  priority: task.priority || 'medium',
                });
              }
            });

            // Time-of reminder (within 5 min of exact due time)
            if (mins >= -5 && mins <= 5) {
              pushIfNew(`task-${task._id}-now`, {
                type: 'TASK',
                title: '⚠️ Task Due NOW!',
                message: `"${task.title}" is due right now!`,
                timestamp: now,
                unread: true,
                category: 'tasks',
                priority: 'high',
              });
            }
          });
        }

        // ── 2. EXAMS ───────────────────────────────────────────────────────
        if (Array.isArray(allExams)) {
          allExams.forEach(exam => {
            if (!exam.date) return;
            const due = new Date(exam.date);
            if (isNaN(due)) return;
            const mins = minsUntil(due);

            const tiers = [
              { key: '7d',  threshold: 60*24*7, min: 60*24*6, label: '7 days' },
              { key: '3d',  threshold: 60*24*3, min: 60*24*2, label: '3 days' },
              { key: '1d',  threshold: 60*24,   min: 60*20,   label: '1 day' },
              { key: '3h',  threshold: 60*3,    min: 60*2,    label: '3 hours' },
            ];
            tiers.forEach(({ key, threshold, min, label }) => {
              if (mins > 0 && mins <= threshold && mins >= min) {
                pushIfNew(`exam-${exam._id}-${key}`, {
                  type: 'EXAM',
                  title: `📝 Exam in ${label}`,
                  message: `${exam.subject || 'Exam'} exam is in ${label}. ${exam.note ? `Note: ${exam.note}` : 'Review your notes!'}`,
                  timestamp: now,
                  unread: true,
                  category: 'exams',
                });
              }
            });
          });
        }

        // ── 3. CLASSES / STUDY SESSIONS ────────────────────────────────────
        if (Array.isArray(allSessions)) {
          allSessions.forEach(session => {
            if (!session.date || session.isCompleted) return;

            // Combine date + startTime to get full datetime
            const dateStr = session.date?.split('T')[0] || session.date;
            const timeStr = session.startTime || '00:00';
            const sessionDt = new Date(`${dateStr}T${timeStr}`);
            if (isNaN(sessionDt)) return;
            const mins = minsUntil(sessionDt);

            const tiers = [
              { key: '1d',  threshold: 60*24, min: 60*20, label: '1 day' },
              { key: '1h',  threshold: 60,    min: 30,    label: '1 hour' },
              { key: '15m', threshold: 15,    min: 0,     label: '15 minutes' },
            ];
            tiers.forEach(({ key, threshold, min, label }) => {
              if (mins > 0 && mins <= threshold && mins >= min) {
                pushIfNew(`session-${session._id}-${key}`, {
                  type: 'CLASS',
                  title: `🎓 Class Reminder — ${label}`,
                  message: `${session.subject || 'Study session'} starts in ${label}${session.topic ? ` · ${session.topic}` : ''}.`,
                  timestamp: now,
                  unread: true,
                  category: 'reminders',
                });
              }
            });
          });
        }

        // ── 4. CALENDAR EVENTS ─────────────────────────────────────────────
        if (Array.isArray(allEvents)) {
          allEvents.forEach(ev => {
            if (!ev.date || ev.isCompleted) return;
            const dateStr = ev.date?.split('T')[0] || ev.date;
            const timeStr = ev.time || '00:00';
            const evDt = new Date(`${dateStr}T${timeStr === 'All Day' ? '00:00' : timeStr}`);
            if (isNaN(evDt)) return;
            const mins = minsUntil(evDt);

            const tiers = [
              { key: '1d', threshold: 60*24, min: 60*20, label: 'tomorrow' },
              { key: '1h', threshold: 60,    min: 30,    label: '1 hour' },
            ];
            tiers.forEach(({ key, threshold, min, label }) => {
              if (mins > 0 && mins <= threshold && mins >= min) {
                pushIfNew(`event-${ev._id}-${key}`, {
                  type: 'CALENDAR',
                  title: `📆 Event ${key === '1d' ? 'Tomorrow' : 'in 1 Hour'}`,
                  message: `"${ev.title}" is ${key === '1d' ? 'tomorrow' : 'in ~1 hour'}.${ev.description ? ` ${ev.description}` : ''}`,
                  timestamp: now,
                  unread: true,
                  category: 'reminders',
                });
              }
            });
          });
        }

        // ── 5. GOAL STREAK ─────────────────────────────────────────────────
        if (currentUser) {
          const streak = currentUser.streak || 0;
          const lastActive = currentUser.lastActiveDate
            ? new Date(currentUser.lastActiveDate)
            : null;
          const hoursSinceActive = lastActive
            ? (now - lastActive.getTime()) / 3600000
            : 999;

          // "Don't break your streak" reminder if no activity today AND it's after 7pm
          const hour = new Date().getHours();
          if (hoursSinceActive > 20 && hour >= 19 && streak > 0) {
            pushIfNew(`streak-risk-${new Date().toDateString()}`, {
              type: 'STREAK',
              title: '🔥 Protect Your Streak!',
              message: `You have a ${streak}-day streak. Log some study time today to keep it alive!`,
              timestamp: now,
              unread: true,
              category: 'reminders',
            });
          }

          // Milestone notifications
          const milestones = [3, 7, 14, 30, 60, 100];
          if (milestones.includes(streak)) {
            pushIfNew(`streak-milestone-${streak}`, {
              type: 'STREAK',
              title: `🔥 ${streak}-Day Streak!`,
              message: `Incredible! You're on a ${streak}-day study streak. Keep it up!`,
              timestamp: now,
              unread: true,
              category: 'reminders',
            });
          }
        }

        // ── 6. REWARDS / XP / LEVEL ────────────────────────────────────────
        if (gamifData) {
          const { level, xp, xpToNextLevel } = gamifData;
          if (xpToNextLevel && xp) {
            const pct = (xp / xpToNextLevel) * 100;
            if (pct >= 90) {
              pushIfNew(`xp-close-${level}-${Math.floor(xp)}`, {
                type: 'REWARD',
                title: '🏆 Almost Level Up!',
                message: `You're ${Math.round(xpToNextLevel - xp)} XP away from Level ${(level || 1) + 1}! Keep studying!`,
                timestamp: now,
                unread: true,
                category: 'reminders',
              });
            }
          }

          // Quest completion (check if any daily quest completed but unclaimed)
          if (gamifData.quests?.daily) {
            gamifData.quests.daily.forEach(q => {
              if (q.completed && !q.claimed) {
                pushIfNew(`quest-done-${q.id}`, {
                  type: 'REWARD',
                  title: '✅ Quest Completed!',
                  message: `Daily quest "${q.title || q.id}" is done! Claim your ${q.reward || ''}XP.`,
                  timestamp: now,
                  unread: true,
                  category: 'reminders',
                });
              }
            });
          }
        }

        // ── 7. WELLNESS BREAK (every 45min of continuous focus) ─────────────
        // We track this via localStorage timestamp of last wellness notif shown
        const lastWellness = parseInt(localStorage.getItem('sm_last_wellness') || '0');
        const msSinceWellness = now - lastWellness;
        if (msSinceWellness >= 45 * 60 * 1000) { // 45 minutes
          const wellnessId = `wellness-${Math.floor(now / (45*60*1000))}`;
          if (!shownIds.has(wellnessId)) {
            const tips = [
              'Look away from the screen — 20-20-20 rule: 20 feet for 20 seconds! 👀',
              'Stretch your neck and shoulders. You\'ve earned it! 🧘',
              'Take a 5-minute walk. Movement boosts focus! 🚶',
              'Drink a glass of water. Hydration helps your brain! 💧',
              'Take 5 deep breaths to reset focus. 🌬️',
            ];
            const tip = tips[Math.floor(Math.random() * tips.length)];
            pushIfNew(wellnessId, {
              type: 'WELLNESS',
              title: '💆 Wellness Break Time',
              message: tip,
              timestamp: now,
              unread: true,
              category: 'reminders',
            });
            localStorage.setItem('sm_last_wellness', now.toString());
          }
        }

        // ── 8. ACHIEVEMENTS (from gamif stats) ────────────────────────────
        if (gamifData?.recentAchievements?.length > 0) {
          gamifData.recentAchievements.forEach(ach => {
            pushIfNew(`achievement-${ach.id}-${ach.tier}`, {
              type: 'ACHIEVEMENT',
              title: `🎖️ Achievement Unlocked!`,
              message: `You earned "${ach.name}" (${ach.tier} tier)! ${ach.description || ''}`,
              timestamp: now,
              unread: true,
              category: 'reminders',
            });
          });
        }

        // ── Add all generated notifications ───────────────────────────────
        if (toAdd.length > 0) {
          setNotifications(prev => {
            // Merge: avoid duplicates
            const existingIds = new Set(prev.map(n => n.id));
            const fresh = toAdd.filter(n => !existingIds.has(n.id));
            if (fresh.length === 0) return prev;
            const merged = [...fresh, ...prev].slice(0, 100);
            persist(merged);

            // Show browser notification for the first high-priority item
            const bp = fresh.find(n => ['TASK','EXAM','ACHIEVEMENT','STREAK'].includes(n.type));
            if (bp) {
              showBrowserNotif(bp.title, bp.message);
            }

            // Show toast for up to 3 fresh items to avoid spamming the screen
            fresh.slice(0, 3).forEach(n => {
              const icon = NOTIF_TYPES[n.type]?.icon || '🔔';
              toast(`${icon} ${n.title}\n${n.message}`, {
                duration: 1000,
                position: 'top-right',
                style: {
                  marginTop: '65px', // Clear the fixed header
                  background: '#333',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  maxWidth: '280px',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                },
              });
            });

            return merged;
          });
        }

      } catch (err) {
        console.error('[Notifications] Generation error:', err);
      }
    };

    generate();
    const interval = setInterval(generate, 60 * 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // ─── Public API ────────────────────────────────────────────────────────────
  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, unread: false } : n);
      persist(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, unread: false }));
      persist(updated);
      return updated;
    });
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    persist([]);
  }, []);

  const snoozeNotification = useCallback((id, minutes = 15) => {
    snoozedRef.current[id] = Date.now() + minutes * 60 * 1000;
    setSnoozed(snoozedRef.current);
    dismissNotification(id);
  }, [dismissNotification]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    snoozeNotification,
    addNotification,
    relativeTime,
    NOTIF_TYPES,
  };
};
