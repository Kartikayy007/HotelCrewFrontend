import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeaders = () => {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1Mzc5MDI1LCJpYXQiOjE3MzI3ODcwMjUsImp0aSI6IjYzYmVjY2UxNjAxNzQzY2I5ZjM4Zjc1YTcwMzJkMjdhIiwidXNlcl9pZCI6MTczfQ.U3Qx2NpNSwHMa8vEFtwpaaz8CKLzkAi0pO7YAnlarPc'; // Replace with your token retrieval logic
    const token=localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
}
// Define the async thunk to fetch the performance data
export const fetchStaffPerformance = createAsyncThunk(
  'performance/fetchStaffPerformance',
  async (_, { rejectWithValue }) => {
      try {
        const url = "https://hotelcrew-1.onrender.com/api/statics/performance/staff/week/";  // Define the URL
        const headers = getAuthHeaders();
      const response = await axios.get(url ,{ headers });
       (response.data);
      return response.data; // Assume the response contains the performance data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch performance data');
    }
  }
);

// Create the slice to handle the state of staff performance data
const performanceSlice = createSlice({
  name: 'performance',
  initialState: {
    weekRange: '',
    dailyStats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.weekRange = action.payload.week_range;
        state.dailyStats = action.payload.daily_stats;
      })
      .addCase(fetchStaffPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectStaffPerformance = (state) => state.performance;
export const selectLoading = (state) => state.performance.loading;
export const selectError = (state) => state.performance.error;
export const selectDailyStats = (state) => state.performance.dailyStats;

export default performanceSlice.reducer;
