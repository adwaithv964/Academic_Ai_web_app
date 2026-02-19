import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], 
    loading: false,
    error: null,
};

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.items = action.payload;
        },
        addCourse: (state, action) => {
            state.items.push(action.payload);
        },
        updateCourse: (state, action) => {
            const index = state.items.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteCourse: (state, action) => {
            state.items = state.items.filter(c => c.id !== action.payload);
        }
    },
});

export const { setCourses, addCourse, updateCourse, deleteCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
