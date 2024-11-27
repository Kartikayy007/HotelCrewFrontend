import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
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
          }
        }
      );
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
const WEEKLY_STATS_URL = 'https://hotelcrew-1.onrender.com/api/attendance/week-stats/';

export const fetchWeeklyAttendance = createAsyncThunk(
  'attendance/fetchWeekly',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(WEEKLY_STATS_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Validate response structure
      const { dates, total_crew_present, total_staff_absent } = response.data;
      if (!Array.isArray(dates) || 
          !Array.isArray(total_crew_present) || 
          !Array.isArray(total_staff_absent)) {
        throw new Error('Invalid response format');
      }

      return {
        dates,
        total_crew_present,
        total_staff_absent
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch weekly attendance');
    }
  }
);

const initialState = {
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
    total_staff_absent: [],
    loading: false,
    error: null,
    lastFetched: null
  },
  lastWeeklyFetch: null,
  loading: false,
  error: null,
  lastFetched: null
};

const adminAttendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWeeklyStats: (state) => {
      state.weeklyStats = initialState.weeklyStats;
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
        state.weeklyStats.loading = true;
        state.weeklyStats.error = null;
      })
      .addCase(fetchWeeklyAttendance.fulfilled, (state, action) => {
        state.weeklyStats = {
          ...action.payload,
          loading: false,
          error: null,
          lastFetched: new Date().toISOString()
        };
      })
      .addCase(fetchWeeklyAttendance.rejected, (state, action) => {
        state.weeklyStats.loading = false;
        state.weeklyStats.error = action.payload;
      });
  }
});

// Selectors
export const selectWeeklyStats = (state) => state.attendance.weeklyStats;
export const selectWeeklyStatsLoading = (state) => state.attendance.weeklyStats.loading;
export const selectWeeklyStatsError = (state) => state.attendance.weeklyStats.error;

export const { clearError, clearWeeklyStats } = adminAttendanceSlice.actions;
export default adminAttendanceSlice.reducer;