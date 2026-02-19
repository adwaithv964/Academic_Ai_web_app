import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('studyMate_focusState');
        if (serializedState === null) {
            return undefined;
        }
        const state = JSON.parse(serializedState);

        
        if (state.isActive && state.lastTick) {
            const now = Date.now();
            const delta = Math.floor((now - state.lastTick) / 1000);

            
            
            if (delta > 0) {
                const newTimeLeft = Math.max(0, state.timeLeft - delta);
                state.timeLeft = newTimeLeft;
                if (newTimeLeft === 0) {
                    state.isActive = false;
                }
            }
        }
        return state;
    } catch (err) {
        return undefined;
    }
};

const initialState = loadState() || {
    isActive: false,
    mode: 'focus', 
    timeLeft: 25 * 60,
    initialDuration: 25 * 60,
    task: null, 
    lastTick: null, 
};

const focusSlice = createSlice({
    name: 'focus',
    initialState,
    reducers: {
        setMode: (state, action) => {
            const mode = action.payload;
            state.mode = mode;
            state.isActive = false;
            if (mode === 'focus') state.initialDuration = 25 * 60;
            if (mode === 'shortBreak') state.initialDuration = 5 * 60;
            if (mode === 'longBreak') state.initialDuration = 60 * 60; 
            state.timeLeft = state.initialDuration;
        },
        setTimeLeft: (state, action) => {
            state.timeLeft = action.payload;
        },
        startTimer: (state) => {
            state.isActive = true;
            state.lastTick = Date.now();
        },
        pauseTimer: (state) => {
            state.isActive = false;
            state.lastTick = null;
        },
        resetTimer: (state) => {
            state.isActive = false;
            state.timeLeft = state.initialDuration;
            state.lastTick = null;
        },
        tick: (state) => {
            if (state.isActive && state.timeLeft > 0) {
                state.timeLeft -= 1;
                state.lastTick = Date.now();
            } else if (state.timeLeft === 0) {
                state.isActive = false;
            }
        },
        setTask: (state, action) => {
            state.task = action.payload;
        },
        setInitialDuration: (state, action) => {
            state.initialDuration = action.payload;
            state.timeLeft = action.payload; 
            state.isActive = false; 
        }
    },
});


export const focusMiddleware = store => next => action => {
    const result = next(action);
    if (action.type.startsWith('focus/')) {
        const state = store.getState().focus;
        localStorage.setItem('studyMate_focusState', JSON.stringify(state));
    }
    return result;
};

export const { setMode, setTimeLeft, startTimer, pauseTimer, resetTimer, tick, setTask, setInitialDuration } = focusSlice.actions;
export default focusSlice.reducer;
