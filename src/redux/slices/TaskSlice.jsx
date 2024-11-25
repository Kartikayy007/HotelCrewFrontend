import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  loading: false,
  error: null
};

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTc4MzMzLCJpYXQiOjE3MzE5ODYzMzMsImp0aSI6IjMxNjk0NTQzNWIzYTQ0MDBhM2MxOGE5M2UzZTk5NTQ0IiwidXNlcl9pZCI6NzF9.Dyl7m7KmXCrMvqbPo31t9q7wWcYgLHCNi9SNO6SPfrY';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Helper function to capitalize department name
const capitalizeDepartment = (department) => {
  return department.charAt(0).toUpperCase() + department.slice(1).toLowerCase();
};

// When sending the task data, transform the department field
const sendTaskData = async (taskData) => {
  const modifiedData = {
    ...taskData,
    department: capitalizeDepartment(taskData.department)
  };

  const response = await fetch('https://hotelcrew-1.onrender.com/api/taskassignment/tasks/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(modifiedData)
  });
  
  return response.json();
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/taskassignment/tasks/all/',
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
        {
          title: taskData.title,
          description: taskData.description,
          department: capitalizeDepartment(taskData.department)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks cases
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create task cases
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const { clearErrors, clearTasks } = taskSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksByStatus = (state, status) => 
  state.tasks.tasks.filter(task => {
    switch(status) {
      case 'pending':
        return task.status === 'pending';
      case 'in_progress': // Fixed to match API
        return task.status === 'in_progress';
      case 'completed':
        return task.status === 'completed';
      default:
        return false;
    }
  });

export default taskSlice.reducer;