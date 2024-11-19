// attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MjY3NzY0LCJpYXQiOjE3MzE2NzU3NjQsImp0aSI6ImQ3NWVmNTUxMmE0NzQ1NWFiYmE3MmVhY2M2NzM0Mzk4IiwidXNlcl9pZCI6NDF9.pX8v_JU3baX_Vq-vavtHdqDgBDZ1tpOJQDgEMjClMRg';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Existing stats fetch
export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/attendance/stats/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.message === 'Authentication token not found') {
        return rejectWithValue('Please login to access this information');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance stats');
    }
  }
);

// New thunk for today's attendance list
export const fetchTodayAttendanceList = createAsyncThunk(
  'attendance/fetchTodayList',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/attendance/list/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Today\'s attendance list:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s attendance');
    }
  }
);

const AdminAttendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    stats: {
      total_crew: 0,
      total_present: 0,
      days_with_records_this_month: 0,
      total_present_month: 0
    },
    todayList: [], // New state for today's attendance list
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Stats cases
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Today's list cases
      .addCase(fetchTodayAttendanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayAttendanceList.fulfilled, (state, action) => {
        state.loading = false;
        state.todayList = action.payload;
        state.error = null;
      })
      .addCase(fetchTodayAttendanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = AdminAttendanceSlice.actions;
export default AdminAttendanceSlice.reducer;