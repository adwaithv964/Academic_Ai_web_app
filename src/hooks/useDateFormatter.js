import { useState, useEffect } from 'react';

const DEFAULT_PREFERENCES = {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    timezone: 'America/New_York'
};

export const useDateFormatter = () => {
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

    useEffect(() => {
        const loadPreferences = () => {
            const saved = localStorage.getItem('userPreferences');
            if (saved) {
                const parsed = JSON.parse(saved);
                setPreferences({
                    dateFormat: parsed.dateFormat || DEFAULT_PREFERENCES.dateFormat,
                    timeFormat: parsed.timeFormat || DEFAULT_PREFERENCES.timeFormat,
                    timezone: parsed.timezone || DEFAULT_PREFERENCES.timezone
                });
            }
        };

        loadPreferences();

        // Listen for storage events to update in real-time across tabs
        window.addEventListener('storage', loadPreferences);

        // Custom event for same-tab updates
        window.addEventListener('preferencesUpdated', loadPreferences);

        return () => {
            window.removeEventListener('storage', loadPreferences);
            window.removeEventListener('preferencesUpdated', loadPreferences);
        };
    }, []);

    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return '';

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: preferences.timezone
        };

        let locale = 'en-US';
        if (preferences.dateFormat === 'DD/MM/YYYY') locale = 'en-GB';
        if (preferences.dateFormat === 'YYYY-MM-DD') locale = 'en-CA';

        return new Intl.DateTimeFormat(locale, options).format(date);
    };

    const formatTime = (dateInput) => {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return '';

        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: preferences.timeFormat === '12',
            timeZone: preferences.timezone
        }).format(date);
    };

    const formatDateTime = (dateInput) => {
        return `${formatDate(dateInput)} ${formatTime(dateInput)}`;
    };

    return {
        formatDate,
        formatTime,
        formatDateTime,
        preferences
    };
};
