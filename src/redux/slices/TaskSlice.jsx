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
  // const token = localStorage.getItem('token');
  const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1NjU3NDk0LCJpYXQiOjE3MzMwNjU0OTQsImp0aSI6ImJmZDY4YzkxOGFjYTQ1MmFhNDRhZDNmY2EzNzc2ZDU2IiwidXNlcl9pZCI6MzEyfQ._g8wBkvMZQjLDn_TpEREshVKK-C8xqCy0tBUItwFXfU';
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

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      console.log('Deleting task with ID:', taskId); // Debug log
      
      const token = getAuthToken();
      await axios.delete(
        `https://hotelcrew-1.onrender.com/api/taskassignment/tasks/delete/${taskId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return taskId;

    } catch (error) {
      console.error('Delete task error:', error); // Debug log
      if (!taskId) {
        return rejectWithValue('Invalid task ID');
      }
      return rejectWithValue(error.response?.data || 'Failed to delete task');
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
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.metrics.total = Math.max(0, state.metrics.total - 1);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

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