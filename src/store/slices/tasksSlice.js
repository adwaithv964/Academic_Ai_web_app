import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    items: [],
    filters: {
        status: 'all', 
        priority: 'all',
    },
    loading: false,
    error: null,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.items = action.payload;
        },
        addTask: (state, action) => {
            state.items.push(action.payload);
        },
        updateTask: (state, action) => {
            const index = state.items.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteTask: (state, action) => {
            state.items = state.items.filter(t => t.id !== action.payload);
        },
        setFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        }
    },
});

export const { setTasks, addTask, updateTask, deleteTask, setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;
