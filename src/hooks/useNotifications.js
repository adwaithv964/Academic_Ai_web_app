import { useState, useEffect } from 'react';

const DEFAULT_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Grade Update Available',
        message: 'Your Mathematics grade has been updated',
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        unread: true
    },
    {
        id: 2,
        title: 'Study Session Reminder',
        message: 'Physics study session starts in 30 minutes',
        timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
        unread: true
    },
    {
        id: 3,
        title: 'Assignment Due Soon',
        message: 'Chemistry lab report due tomorrow',
        timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
        unread: false
    }
];

const STORAGE_KEY = 'academic_notifications';
const TIMESTAMP_KEY = 'academic_notifications_timestamp';
const REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const loadNotifications = () => {
            const storedNotifications = localStorage.getItem(STORAGE_KEY);
            const lastGeneration = localStorage.getItem(TIMESTAMP_KEY);
            const now = Date.now();

            if (!storedNotifications || !lastGeneration || (now - parseInt(lastGeneration) > REFRESH_INTERVAL)) {
                // Initialize or Refresh
                setNotifications(DEFAULT_NOTIFICATIONS);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
                localStorage.setItem(TIMESTAMP_KEY, now.toString());
            } else {
                // Load existing
                setNotifications(JSON.parse(storedNotifications));
            }
        };

        loadNotifications();
    }, []);

    const updateNotifications = (newNotifications) => {
        setNotifications(newNotifications);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
    };

    const markAsRead = (id) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, unread: false } : n
        );
        updateNotifications(updated);
    };

    const clearAll = () => {
        updateNotifications([]);
    };

    return {
        notifications,
        markAsRead,
        clearAll
    };
};
