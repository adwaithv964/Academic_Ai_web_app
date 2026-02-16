import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { currentUser } = useAuth();
    // Default to 'default' (Light) or 'dark' if system pref? Let's stick to app setting.
    // Actually, 'default' in our Tailwind setup usually implies light mode unless .dark class is added.
    // Our store has 'theme_dark', 'theme_cyberpunk', 'theme_nature'.
    // We should map these to CSS classes.
    const [theme, setTheme] = useState('default');

    // Load from user profile on mount/auth
    useEffect(() => {
        if (currentUser && currentUser.preferences?.display?.activeTheme) {
            setTheme(currentUser.preferences.display.activeTheme);
        }
    }, [currentUser]);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Remove all known theme classes
        root.classList.remove('dark', 'theme-cyberpunk', 'theme-nature');

        // Apply new theme
        if (theme === 'theme_dark') {
            root.classList.add('dark');
        } else if (theme === 'theme_cyberpunk') {
            root.classList.add('dark', 'theme-cyberpunk'); // Cyberpunk is dark-based
        } else if (theme === 'theme_nature') {
            // Nature could be light or dark, let's say light based but green
            root.classList.add('theme-nature');
        }
        // 'default' does nothing (light mode)

    }, [theme]);

    const updateTheme = async (newThemeId) => {
        setTheme(newThemeId);
        if (currentUser) {
            try {
                // We'll add this method to api.js next
                // Optimistic UI update already happened above
                await api.user.updateTheme(newThemeId);
            } catch (err) {
                console.error("Failed to sync theme:", err);
                // Optionally revert? Nah, non-critical.
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
