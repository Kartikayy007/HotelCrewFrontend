// src/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define a function to get the authorization headers
const getAuthHeaders = () => {
    const token =localStorage.getItem('token');
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1Mzc5MDI1LCJpYXQiOjE3MzI3ODcwMjUsImp0aSI6IjYzYmVjY2UxNjAxNzQzY2I5ZjM4Zjc1YTcwMzJkMjdhIiwidXNlcl9pZCI6MTczfQ.U3Qx2NpNSwHMa8vEFtwpaaz8CKLzkAi0pO7YAnlarPc';
    return {
        Authorization: `Bearer ${token}`
    }
};

// Define the initial state
const initialState = {
    tasks: [],
    count: 0,
    loading: false,
    error: null,
};

// Define the async thunk for fetching tasks
export const fetchStaffTasks = createAsyncThunk(
    'stafftasks/fetchStaffTasks', // Action name
    async (_, { rejectWithValue }) => { // No staffId, just dispatch the request without a parameter
        try {
            const response = await axios.get(
                `https://hotelcrew-1.onrender.com/api/taskassignment/tasks/staff/`,  // No staffId in the URL
                { headers: getAuthHeaders() } // Pass Authorization header here
            );
            console.log("Fetched tasks:", response.data); // Log to check response data
            return response.data; // Return the data
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to load tasks'); // Return error message
        }
    }
);
export const updateStaffTaskStatus = createAsyncThunk(
    'stafftasks/updateStaffTaskStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `https://hotelcrew-1.onrender.com/api/taskassignment/tasks/staff/${id}/`, // Task ID in the URL
                { status }, // Send status in the request body
                { headers: getAuthHeaders() } // Include Authorization header
            );
            console.log("Task status updated:", response.data); // Log to check response data
            return response.data; // Return the success message and status
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to update task status'); // Return error message
        }
    }
);

// Create the slice
const taskSlice = createSlice({
    name: 'stafftasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStaffTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.count = action.payload.count;
                state.tasks = action.payload.results;
            })
            .addCase(fetchStaffTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to load tasks';
            })


            .addCase(updateStaffTaskStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateStaffTaskStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update task status locally in the tasks array
                console.log(updatedTask);
                const updatedTask = action.payload;
                // const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
                // if (index !== -1) {
                //   state.tasks[index] = updatedTask;
                // }
                const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
                if (index !== -1) {
                    // Merge the updated fields with the existing task
                    state.tasks[index] = {
                        ...state.tasks[index], // Existing task fields
                        status: updatedTask.status // Updated field(s)
                    };
                }
            })
            .addCase(updateStaffTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update task status';
            });
    },
});

// Export selectors to access the state
export const selectStaffTasks = (state) => state.stafftasks.tasks;
export const selectStaffTaskCount = (state) => state.stafftasks.count;
export const selectStaffTaskLoading = (state) => state.stafftasks.loading;
export const selectStaffTaskError = (state) => state.stafftasks.error;

// Export the reducer
export default taskSlice.reducer;
