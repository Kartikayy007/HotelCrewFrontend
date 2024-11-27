import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Function to retrieve the authentication token
const getAuthToken = () => {
  const token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MzI2OTkxLCJpYXQiOjE3MzI3MzQ5OTEsImp0aSI6IjNmMTM5OTIyZmYzZjQ5ZDhiOWYyOGM5ZWM1NTAzODBkIiwidXNlcl9pZCI6MTc1fQ.xn3Xra_d-fyzTxUhJFG8GpruS2scKPP2V0XmtaNT8kA';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Thunk to fetch monthly attendance date-wise
export const getMonthlyAttendance = createAsyncThunk(
    'staffAttendance/getMonthlyAttendance',
    async (_, { rejectWithValue }) => {
      try {
        const token = getAuthToken(); // Retrieve auth token
        const response = await axios.get(
          `https://hotelcrew-1.onrender.com/api/attendance/month-check/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Monthly data: ",response.data);
        return response.data; // Return the fetched data
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch monthly attendance');
      }
    }
  );
  
  

// Thunk to fetch attendance statistics
export const getAttendanceStats = createAsyncThunk(
    'staffAttendance/getAttendanceStats',
    async (_, { rejectWithValue }) => {
      try {
        const token = getAuthToken(); // Retrieve auth token
        const response = await axios.get(
          `https://hotelcrew-1.onrender.com/api/attendance/month/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        console.log(response.data);
        return response.data; // Return the fetched data
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch attendance stats');
      }
    }
  );

const attendanceSlice = createSlice({
  name: 'staffAttendance',
  initialState: {
    // State for monthly attendance
    monthlyAttendance: [],
    monthlyLoading: false,
    monthlyError: null,

    // State for attendance stats
    attendanceStats: null,
    statsLoading: false,
    statsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling getMonthlyAttendance thunk
    builder
      .addCase(getMonthlyAttendance.pending, (state) => {
        state.monthlyLoading = true;
        state.monthlyError = null;
      })
      .addCase(getMonthlyAttendance.fulfilled, (state, action) => {
        console.log("Monthly Payload",action.payload);
        state.monthlyLoading = false;
        state.monthlyAttendance = action.payload.results; // Set the monthly attendance data
      })
      .addCase(getMonthlyAttendance.rejected, (state, action) => {
        state.monthlyLoading = false;
        state.monthlyError = action.payload;
      });

    // Handling getAttendanceStats thunk
    builder
      .addCase(getAttendanceStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(getAttendanceStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.attendanceStats = action.payload; // Set the stats data
      })
      .addCase(getAttendanceStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  },
});
export const selectMonthlyAttendance = (state) => state.staffAttendance.monthlyAttendance;
export const selectMonthlyLoading = (state) => state.staffAttendance.monthlyLoading;
export const selectMonthlyError = (state) => state.staffAttendance.monthlyError;
export const selectAttendanceStats = (state) => state.staffAttendance.attendanceStats;
export const selectStatsLoading = (state) => state.staffAttendance.statsLoading;
export const selectStatsError = (state) => state.staffAttendance.statsError;
export default attendanceSlice.reducer;
