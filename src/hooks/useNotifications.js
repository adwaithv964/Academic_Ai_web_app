import { useState, useEffect } from 'react';
import { tasks as tasksApi, sessions as sessionsApi, exams as examsApi } from '../services/api';

const STORAGE_KEY = 'academic_notifications';
const TIMESTAMP_KEY = 'academic_notifications_timestamp';
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchAndGenerateNotifications = async () => {
            try {
                // Fetch real data
                const [allTasks, allSessions, allExams] = await Promise.all([
                    tasksApi.list().catch(() => []),
                    sessionsApi.list().catch(() => []),
                    examsApi.list().catch(() => [])
                ]);

                const generatedNotifications = [];
                const now = new Date();
                const oneDay = 24 * 60 * 60 * 1000;
                const oneHour = 60 * 60 * 1000;

                // 1. Task/Assignment Deadlines (Due within 24 hours)
                allTasks.forEach(task => {
                    if (task.dueDate && !task.completed) {
                        const dueDate = new Date(task.dueDate);
                        // Check if valid date
                        if (!isNaN(dueDate.getTime())) {
                            const diff = dueDate - now;
                            if (diff > 0 && diff < oneDay) {
                                generatedNotifications.push({
                                    id: `task-${task._id || task.id}`,
                                    title: 'Assignment Due Soon',
                                    message: `"${task.title}" is due in ${Math.ceil(diff / oneHour)} hours.`,
                                    timestamp: now.getTime(),
                                    unread: true
                                });
                            }
                        }
                    }
                });

                // 2. Upcoming Study Sessions (Starts within 1 hour)
                allSessions.forEach(session => {
                    if (session.date) {
                        const sessionDate = new Date(session.date);
                        // Combine date and time if mock data or string
                        // Assuming session.date is full ISO or we need to parse time separately.
                        // For simplicity, using session.date as start time
                        if (!isNaN(sessionDate.getTime())) {
                            const diff = sessionDate - now;
                            if (diff > 0 && diff < oneHour) {
                                generatedNotifications.push({
                                    id: `session-${session._id || session.id}`,
                                    title: 'Study Session Reminder',
                                    message: `Session for ${session.subject} starts in ${Math.ceil(diff / (60 * 1000))} minutes.`,
                                    timestamp: now.getTime(),
                                    unread: true
                                });
                            }
                        }
                    }
                });

                // 3. Upcoming Exams (Within 48 hours)
                allExams.forEach(exam => {
                    if (exam.date) {
                        const examDate = new Date(exam.date);
                        if (!isNaN(examDate.getTime())) {
                            const diff = examDate - now;
                            if (diff > 0 && diff < (2 * oneDay)) {
                                generatedNotifications.push({
                                    id: `exam-${exam._id || exam.id}`,
                                    title: 'Exam Upcoming',
                                    message: `${exam.subject} Exam is on ${examDate.toLocaleDateString()}.`,
                                    timestamp: now.getTime(),
                                    unread: true
                                });
                            }
                        }
                    }
                });

                // Merge with stored manual notifications (if any)
                // For now, we overwrite with fresh data + preserve read status if ID matches
                // but simpler to just set fresh ones for this request

                // Load read status from storage to preserve it
                const storedData = localStorage.getItem(STORAGE_KEY);
                let storedNotifications = storedData ? JSON.parse(storedData) : [];

                // Map read status
                const finalNotifications = generatedNotifications.map(n => {
                    const existing = storedNotifications.find(s => s.id === n.id);
                    return existing ? { ...n, unread: existing.unread } : n;
                });

                setNotifications(finalNotifications);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(finalNotifications));
                localStorage.setItem(TIMESTAMP_KEY, now.toString());

            } catch (error) {
                console.error("Failed to generate notifications:", error);
            }
        };

        fetchAndGenerateNotifications();

        // Poll every minute
        const interval = setInterval(fetchAndGenerateNotifications, 60 * 1000);
        return () => clearInterval(interval);

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

    const unreadCount = notifications.filter(n => n.unread).length;

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: Date.now(), // Ensure timestamp is set
            unread: true,
            ...notification
        };
        const updated = [newNotification, ...notifications];
        updateNotifications(updated);
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        clearAll,
        addNotification
    };
};
