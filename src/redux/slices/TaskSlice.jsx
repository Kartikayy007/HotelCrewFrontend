import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeaders = () => {
  // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MTg3MDQ2LCJpYXQiOjE3MzI1OTUwNDYsImp0aSI6Ijc1Y2Q2MzZkYTk5MTQ5ZWFiMjA2ZjBlNjZhODMwZTY2IiwidXNlcl9pZCI6MTA5fQ.xIQKLkKU6TMTbqBlw8f4GGxhpWJt6U9FA7RVfMPGSwQ';
  const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDExLCJpYXQiOjE3MzI2MTM0MTEsImp0aSI6ImI2MzkyNjAwNTU3ZDQ0YTQ5MWE5NTA4ZDlkN2M0OWM4IiwidXNlcl9pZCI6MTQ5fQ.8sZK2idIczWT3l-EAEmGWLGIKMaXwR5eOKXApDf_Kik';
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Thunk to fetch the task list
export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/taskassignment/tasks/all/',
        { headers: getAuthHeaders() }
      );
      return response.data; // API returns `count` and `results`
    } catch (error) {
      return rejectWithValue(error.response.data || 'Something went wrong');
    }
  }
);

// Thunk to create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/taskassignment/tasks/', 
        taskData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Something went wrong');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [], // To store the task results
    count: 0, // To store the count of tasks
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getTasks
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.results);
        state.tasks = action.payload.results; // Populate tasks from `results`
        state.count = action.payload.count;   // Populate count from API response
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload); // Add the new task to the tasks list
        state.count += 1; // Increment the count
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors to get tasks and count from the state
export const selectTasks = (state) => state.tasks?.tasks;
export const selectTaskCount = (state) => state.tasks?.count;
export const selectTasksLoading = (state) => state.tasks?.loading;
export const selectTasksError = (state) => state.tasks?.error;

export default taskSlice.reducer;
