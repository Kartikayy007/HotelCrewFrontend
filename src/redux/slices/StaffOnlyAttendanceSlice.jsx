import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};


export const getMonthlyAttendance = createAsyncThunk(
  'staffOnlyAttendance/getMonthlyAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken(); 
      const response = await axios.get(
        `https://hotelcrew-1.onrender.com/api/attendance/month-check/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Monthly Attendance Response:', response.data); // Add for debugging
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch monthly attendance');
    }
  }
);



export const getAttendanceStats = createAsyncThunk(
  'staffOnlyAttendance/getAttendanceStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `https://hotelcrew-1.onrender.com/api/attendance/month/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Attendance Stats Response:', response.data); // Add for debugging
      return {
        days_present: parseInt(response.data.days_present) || 0,
        leaves: parseInt(response.data.leaves) || 0,
        total_days_up_to_today: parseInt(response.data.total_days_up_to_today) || 0
      };
    } catch (error) {
      console.error('Attendance Stats Error:', error); // Add for debugging
      return rejectWithValue(error.response?.data || 'Failed to fetch attendance stats');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'staffOnlyAttendance',
  initialState: {
   
    monthlyAttendance: [],
    monthlyLoading: false,
    monthlyError: null,

    
    attendanceStats: {
      days_present: 0,
      leaves: 0,
      total_days_up_to_today: 0
    },
    statsLoading: false,
    statsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    
    builder
      .addCase(getMonthlyAttendance.pending, (state) => {
        state.monthlyLoading = true;
        state.monthlyError = null;
      })
      .addCase(getMonthlyAttendance.fulfilled, (state, action) => {
        console.log("Monthly Payload", action.payload);
        state.monthlyLoading = false;
        state.monthlyAttendance = action.payload;
        state.monthlyError = null;
      })
      .addCase(getMonthlyAttendance.rejected, (state, action) => {
        state.monthlyLoading = false;
        state.monthlyError = action.payload;
      });

    
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
export const selectMonthlyAttendance = (state) => state.staffOnlyAttendance.monthlyAttendance;
export const selectMonthlyLoading = (state) => state.staffOnlyAttendance.monthlyLoading;
export const selectMonthlyError = (state) => state.staffOnlyAttendance.monthlyError;
export const selectAttendanceStats = (state) => state.staffOnlyAttendance.attendanceStats;
export const selectStatsLoading = (state) => state.staffOnlyAttendance.statsLoading;
export const selectStatsError = (state) => state.staffOnlyAttendance.statsError;
export default attendanceSlice.reducer;
