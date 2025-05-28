// src/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('No access token found');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const initialState = { 
    tasks: [],
    count: 0,
    loading: false,
    error: null,
};


export const updateStaffTaskStatus = createAsyncThunk(
    'stafftasks/updateStaffTaskStatus',
    async ({ id, status }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.patch(
                `https://hotelcrew-1.onrender.com/api/taskassignment/tasks/status/${id}/`, 
                { status }, 
                { headers: getAuthHeaders() } 
            );
            
            // Wait for the update to complete then fetch fresh data
            await dispatch(fetchStaffTasks()).unwrap();
            return response.data;
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                // Handle token expiration
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return rejectWithValue('Session expired. Please login again.');
            }
            return rejectWithValue(err.response?.data || 'Failed to update task status');
        }
    }
);

export const fetchStaffTasks = createAsyncThunk(
    'stafftasks/fetchStaffTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://hotelcrew-1.onrender.com/api/taskassignment/tasks/staff/`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return rejectWithValue('Session expired. Please login again.');
            }
            return rejectWithValue(err.response?.data || 'Failed to load tasks');
        }
    }
);


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
                console.log("Updated task status:", action.payload);
                //  (updatedTask);
                // const updatedTask = action.payload;
                // // const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
                // // if (index !== -1) {
                // //   state.tasks[index] = updatedTask;
                // // }
                // const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
                // if (index !== -1) {
                    
                //     state.tasks[index] = {
                //         ...state.tasks[index], 
                //         status: updatedTask.status 
                //     };
                // }
            })
            .addCase(updateStaffTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update task status';
            });
    },
});




export const selectStaffTasks = (state) => state.stafftasks.tasks;
export const selectStaffTaskCount = (state) => state.stafftasks.count;
export const selectStaffTaskLoading = (state) => state.stafftasks.loading;
export const selectStaffTaskError = (state) => state.stafftasks.error;


export default taskSlice.reducer;
