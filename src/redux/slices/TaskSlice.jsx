import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null
  }
};

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  return token;
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (pageParam = '', { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `https://hotelcrew-1.onrender.com/api/taskassignment/tasks/all/${pageParam}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/taskassignment/tasks/',
        taskData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
       ('Created task:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      return rejectWithValue(error.response?.data || 'Failed to create task');
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.pagination = {
        count: 0,
        next: null,
        previous: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        // Update tasks with new page data
        state.tasks = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous
        };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.pagination.count += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectAllTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectPagination = (state) => state.tasks.pagination;
export const selectTasksByStatus = (state, status) => 
  state.tasks.tasks.filter(task => {
    switch(status) {
      case 'pending':
        return task.status.toLowerCase() === 'pending';
      case 'in_progress': 
        return task.status.toLowerCase() === 'in_progress';
      case 'completed':
        return task.status.toLowerCase() === 'completed';
      default:
        return false;
    }
  });

// const tasks = useSelector(selectAllTasks);
// const inProgressCount = tasks.filter(task => task.status === "in_progress").length;
// const pendingCount = tasks.filter(task => task.status === "pending").length;
// const busyStaffCount = inProgressCount + pendingCount;
// const vacantStaffCount = Math.max(0, totalStaff - busyStaffCount);

export default taskSlice.reducer;