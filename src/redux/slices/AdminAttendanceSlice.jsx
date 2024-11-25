import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTk5ODM1LCJpYXQiOjE3MzIwMDc4MzUsImp0aSI6ImYxYzFkODE1NTU3NTQzYjhiNWRlMzYzOTNmOTAxYThmIiwidXNlcl9pZCI6NjR9.dxiN8N9Cf7EWpg33MgjluaCfemeRxMytdD613bDhzWc';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

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
       ('Today\'s attendance list:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s attendance');
    }
  }
);

// Update cache duration to 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'weekly_attendance_data';

// Add helper functions for cache
const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

const setCacheData = (data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Cache setting error:', error);
  }
};

// Update fetchWeeklyAttendance thunk
export const fetchWeeklyAttendance = createAsyncThunk(
  'attendance/fetchWeekly',
  async (_, { dispatch }) => {
    try {
      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        // Return cached data with a flag
        return { data: cachedData, fromCache: true };
      }

      // If no cache, fetch from API
      const token = getAuthToken();
      const response = await axios.get(
        'http://13.200.191.108:8000/api/attendance/week-stats/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Cache the new data
      setCacheData(response.data);
      return { data: response.data, fromCache: false };
    } catch (error) {
      throw error;
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
    todayList: [],
    weeklyStats: {
      dates: [],
      total_crew_present: [],
      total_staff_absent: []
    },
    lastWeeklyFetch: null,
    loading: false,
    error: null,
    lastFetched: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchWeeklyAttendance.pending, (state) => {
        if (!state.weeklyStats.dates.length) {
          state.loading = true;
        }
      })
      .addCase(fetchWeeklyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyStats = action.payload.data;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchWeeklyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = AdminAttendanceSlice.actions;
export default AdminAttendanceSlice.reducer;