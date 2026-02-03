import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import tasksReducer from './slices/tasksSlice';
import coursesReducer from './slices/coursesSlice';
import sessionsReducer from './slices/sessionsSlice';
import focusReducer, { focusMiddleware } from './slices/focusSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        tasks: tasksReducer,
        courses: coursesReducer,
        sessions: sessionsReducer,
        focus: focusReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(focusMiddleware),
});
