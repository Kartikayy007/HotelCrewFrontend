import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  metrics: {
    total: 0,
    completed: 0,
    pending: 0
  },
  loading: false,
  error: null
};

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  return token;
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/taskassignment/tasks/day/',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Fetched tasks:', response.data.tasks);
      // Extract tasks array from response
      return {
        tasks: Array.isArray(response.data.tasks) ? response.data.tasks : [],
        metrics: {
          total: response.data.totaltask || 0,
          completed: response.data.taskcompleted || 0,
          pending: response.data.taskpending || 0
        }
      };
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
      return response.data;
    } catch (error) {
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
      state.metrics = initialState.metrics;
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
        state.tasks = action.payload.tasks;
        state.metrics = action.payload.metrics;
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
        state.tasks = Array.isArray(state.tasks) 
          ? [...state.tasks, action.payload]
          : [action.payload];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Updated selectors with type checking
export const selectAllTasks = (state) => {
  return Array.isArray(state?.tasks?.tasks) ? state.tasks.tasks : [];
};

export const selectTasksLoading = (state) => state?.tasks?.loading || false;
export const selectTasksError = (state) => state?.tasks?.error || null;

export const selectTasksByStatus = (state, status) => {
  const tasks = selectAllTasks(state);
  return tasks.filter(task => {
    if (!task?.status) return false;
    
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
};

export const selectTaskMetrics = (state) => state?.tasks?.metrics || initialState.metrics;

export const { clearErrors, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;