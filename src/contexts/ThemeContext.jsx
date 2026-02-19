import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    
    
    
    const [theme, setTheme] = useState('default');

    
    useEffect(() => {
        if (currentUser && currentUser.preferences?.display?.activeTheme) {
            setTheme(currentUser.preferences.display.activeTheme);
        }
    }, [currentUser]);

    
    useEffect(() => {
        const root = document.documentElement;

        
        root.classList.remove('dark', 'theme-cyberpunk', 'theme-nature');

        
        if (theme === 'theme_dark') {
            root.classList.add('dark');
        } else if (theme === 'theme_cyberpunk') {
            root.classList.add('dark', 'theme-cyberpunk'); 
        } else if (theme === 'theme_nature') {
            
            root.classList.add('theme-nature');
        }
        

    }, [theme]);

    const updateTheme = async (newThemeId) => {
        setTheme(newThemeId);
        if (currentUser) {
            try {
                
                
                await api.user.updateTheme(newThemeId);
            } catch (err) {
                console.error("Failed to sync theme:", err);
                
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
