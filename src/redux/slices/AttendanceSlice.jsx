import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api';

// Async thunks
export const fetchAttendance = createAsyncThunk(
  'managerAttendance/fetchAttendance',
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
  'managerAttendance/updateAttendance',
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
  'managerAttendance/fetchAttendanceStats',
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
const managerAttendanceSlice = createSlice({
  name: 'managerAttendance', // Updated key
  initialState: {
    staff: [],
    stats: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    statsLoading: false,
    statsError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.statsError = null;  
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(updateAttendance.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { staffId, result } = action.payload;
        state.staff = state.staff.map(member =>
          member.id === staffId
            ? { ...member, current_attendance: result.attendance ? 'Present' : 'Absent' }
            : member
        );
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
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
  },
});

// Updated selectors
export const selectManagerAttendanceStaff = (state) => state.managerAttendance.staff;
export const selectManagerAttendanceLoading = (state) => state.managerAttendance.loading;
export const selectManagerAttendanceError = (state) => state.managerAttendance.error;
export const selectManagerAttendanceUpdateLoading = (state) =>
  state.managerAttendance.updateLoading;
export const selectManagerAttendanceUpdateError = (state) =>
  state.managerAttendance.updateError;
export const selectManagerAttendanceStats = (state) => state.managerAttendance.stats;
export const selectManagerAttendanceStatsLoading = (state) =>
  state.managerAttendance.statsLoading;
export const selectManagerAttendanceStatsError = (state) =>
  state.managerAttendance.statsError;

export const { clearErrors } = managerAttendanceSlice.actions;

export default managerAttendanceSlice.reducer;
