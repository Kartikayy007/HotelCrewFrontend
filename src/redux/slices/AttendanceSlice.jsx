import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api';

// Async thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/attendance/list/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch attendance');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async (staffId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/attendance/change/${staffId}/`, 
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      return { staffId, result: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update attendance');
    }
  }
);

// Add this new thunk
export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchAttendanceStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/attendance/stats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch attendance stats');
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    staff: [],
    stats: null, // Add this
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    statsLoading: false, // Add this
    statsError: null    // Add this
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.statsError = null;  
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { staffId, result } = action.payload;
        state.staff = state.staff.map(member => 
          member.id === staffId ? 
          { ...member, current_attendance: result.attendance ? 'Present' : 'Absent' } 
          : member
        );
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Add these new cases
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  }
});

// Selectors
export const selectStaff = (state) => state.attendance.staff;
export const selectLoading = (state) => state.attendance.loading;
export const selectError = (state) => state.attendance.error;
export const selectUpdateLoading = (state) => state.attendance.updateLoading;
export const selectUpdateError = (state) => state.attendance.updateError;

// Add these new selectors
export const selectStats = (state) => state.attendance.stats;
export const selectStatsLoading = (state) => state.attendance.statsLoading;
export const selectStatsError = (state) => state.attendance.statsError;

export const { clearErrors } = attendanceSlice.actions;

export default attendanceSlice.reducer;