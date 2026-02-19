import { useState, useEffect } from 'react';
import { tasks as tasksApi, sessions as sessionsApi, exams as examsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'academic_notifications';
const TIMESTAMP_KEY = 'academic_notifications_timestamp';
const REFRESH_INTERVAL = 5 * 60 * 1000; 

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const fetchAndGenerateNotifications = async () => {
            try {
                
                const [allTasks, allSessions, allExams] = await Promise.all([
                    tasksApi.list().catch(() => []),
                    sessionsApi.list().catch(() => []),
                    examsApi.list().catch(() => [])
                ]);

                const generatedNotifications = [];
                const now = new Date();
                const oneDay = 24 * 60 * 60 * 1000;
                const oneHour = 60 * 60 * 1000;

                
                allTasks.forEach(task => {
                    if (task.dueDate && !task.completed) {
                        const dueDate = new Date(task.dueDate);
                        
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

                
                allSessions.forEach(session => {
                    if (session.date) {
                        const sessionDate = new Date(session.date);
                        
                        
                        
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

                
                
                

                
                const storedData = localStorage.getItem(STORAGE_KEY);
                let storedNotifications = storedData ? JSON.parse(storedData) : [];

                
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

        
        const interval = setInterval(fetchAndGenerateNotifications, 60 * 1000);
        return () => clearInterval(interval);

    }, [currentUser]);

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
            timestamp: Date.now(), 
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
