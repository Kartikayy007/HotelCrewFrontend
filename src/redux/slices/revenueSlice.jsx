import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* Cached version
const CACHE_KEY = 'revenue_stats';
const CACHE_DURATION = 6 * 60 * 60 * 1000;
*/

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

/* Cached version functions
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
}; */
export const fetchRevenueStats = createAsyncThunk(
  'revenue/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get('https://hotelcrew-1.onrender.com/api/hoteldetails/room-stats/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch revenue stats');
    }
  }
);

const revenueSlice = createSlice({
  name: 'revenue',
  initialState: {
    dates: [],
    dailyRevenues: [],
    daily_checkins: [],
    daily_checkouts: [],
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
        state.daily_checkins = action.payload.daily_checkins;
        state.daily_checkouts = action.payload.daily_checkouts;
        
        // Format the week range
        const firstDate = new Date(action.payload.dates[0]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        const lastDate = new Date(action.payload.dates[action.payload.dates.length - 1]).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        state.weekRange = `${firstDate} - ${lastDate}`;
        
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchRevenueStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectRoomStats = (state) => ({
  dates: state.revenue.dates,
  daily_checkins: state.revenue.daily_checkins,
  daily_checkouts: state.revenue.daily_checkouts
});

export const selectLatestRevenue = (state) => {
  const dailyRevenues = state.revenue.dailyRevenues;
  return dailyRevenues[dailyRevenues.length - 1] || 0;
};


export const { setInitialData } = revenueSlice.actions;
export default revenueSlice.reducer;