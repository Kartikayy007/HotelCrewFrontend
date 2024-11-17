import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
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
      
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch attendance stats');
      } else if (error.request) {
        return rejectWithValue('Network error. Please check your connection');
      } else {
        return rejectWithValue(error.message);
      }
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
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch attendance stats';
      });
  }
});

export const { clearError } = AdminAttendanceSlice.actions;

export default AdminAttendanceSlice.reducer;