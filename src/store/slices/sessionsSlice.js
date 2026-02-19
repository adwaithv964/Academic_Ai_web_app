import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: [], 
    currentSession: null, 
    loading: false,
};

const sessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        startSession: (state, action) => {
            state.currentSession = {
                startTime: new Date().toISOString(),
                status: 'running',
                ...action.payload
            };
        },
        endSession: (state, action) => {
            if (state.currentSession) {
                const session = {
                    ...state.currentSession,
                    endTime: new Date().toISOString(),
                    duration: action.payload.duration, 
                    completed: true
                };
                state.history.push(session);
                state.currentSession = null;
            }
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        }
    },
});

export const { startSession, endSession, setHistory } = sessionsSlice.actions;
export default sessionsSlice.reducer;
