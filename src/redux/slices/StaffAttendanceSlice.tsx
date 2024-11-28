import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface StaffAttendanceData {
  user: null;
  month: string;
  days_present: number;
  leaves: number;
  total_days_up_to_today: number;
}

interface StaffAttendanceState {
  data: StaffAttendanceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffAttendanceState = {
  data: null,
  loading: false,
  error: null
};

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  if (!token) throw new Error('Authentication token not found');
  return token;
}

export const fetchStaffAttendance = createAsyncThunk(
  'staffAttendance/fetchStaffAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/attendance/month/',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch staff attendance');
    }
  }
);

const staffAttendanceSlice = createSlice({
  name: 'staffAttendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchStaffAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectStaffAttendance = (state: { staffAttendance: StaffAttendanceState }) => state.staffAttendance.data;
export const selectStaffAttendanceLoading = (state: { staffAttendance: StaffAttendanceState }) => state.staffAttendance.loading;
export const selectStaffAttendanceError = (state: { staffAttendance: StaffAttendanceState }) => state.staffAttendance.error;

export default staffAttendanceSlice.reducer;