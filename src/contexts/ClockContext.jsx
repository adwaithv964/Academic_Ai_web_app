import React, { createContext, useState, useEffect, useContext } from 'react';

const ClockContext = createContext();

export const useClock = () => {
    const context = useContext(ClockContext);
    if (!context) {
        throw new Error('useClock must be used within a ClockProvider');
    }
    return context;
};

export const ClockProvider = ({ children }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const value = {
        currentTime,
    };

    return (
        <ClockContext.Provider value={value}>
            {children}
        </ClockContext.Provider>
    );
};
