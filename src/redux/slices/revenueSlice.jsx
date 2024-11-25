// revenueSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CACHE_KEY = 'revenue_stats';
const CACHE_DURATION = 6 * 60 * 60 * 1000; 

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NjMwMzg3LCJpYXQiOjE3MzIwMzgzODcsImp0aSI6ImViZTM5MjA1NDU4MzQ2MjBiNGEzN2JiOGVkN2NlMGM3IiwidXNlcl9pZCI6NzZ9.G8FG8hLXSJojgblmPmWr3EOC9uS96ysnLvxIbdBNOoc';
  if (!token) throw new Error('Authentication token not found');
  return token;
};

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

export const fetchRevenueStats = createAsyncThunk(
  'revenue/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const cachedData = getCachedData();
      if (cachedData) {
        return cachedData;
      }

      const token = getAuthToken();
      const response = await axios.get('http://13.200.191.108:8000/api/hoteldetails/room-stats/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCacheData(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const revenueSlice = createSlice({
  name: 'revenue',
  initialState: {
    dates: [],
    dailyRevenues: [],
    loading: true,
    error: null,
    lastFetched: null
  },
  reducers: {
    setInitialData: (state, action) => {
      state.dates = action.payload.dates;
      state.dailyRevenues = action.payload.dailyRevenues;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueStats.pending, (state) => {
        if (!state.dates.length) {
          state.loading = true;
        }
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dates = action.payload.dates;
        state.dailyRevenues = action.payload.daily_revenues;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchRevenueStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setInitialData } = revenueSlice.actions;

export default revenueSlice.reducer;