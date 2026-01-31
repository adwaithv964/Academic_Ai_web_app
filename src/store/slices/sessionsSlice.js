import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: [], // [{ id, courseId, startTime, endTime, duration, notes }]
    currentSession: null, // { startTime, courseId, status: 'running'|'paused' }
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
                    duration: action.payload.duration, // in seconds
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
