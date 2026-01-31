import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import tasksReducer from './slices/tasksSlice';
import coursesReducer from './slices/coursesSlice';
import sessionsReducer from './slices/sessionsSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        tasks: tasksReducer,
        courses: coursesReducer,
        sessions: sessionsReducer,
    },
});
