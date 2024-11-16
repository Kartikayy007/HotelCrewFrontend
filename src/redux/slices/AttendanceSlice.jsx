import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Endpoints
const FETCH_ATTENDANCE_URL = 'https://hotelcrew-1.onrender.com/api/attendance/list/';
const UPDATE_ATTENDANCE_URL = 'https://hotelcrew-1.onrender.com/api/attendance/change/42/';

// Thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async () => {
    const response = await axios.get(FETCH_ATTENDANCE_URL);
    return response.data;
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async (id) => {
    const response = await axios.post(UPDATE_ATTENDANCE_URL, { id });
    return { id, ...response.data };
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    staff: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
        state.error = action.error.message;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        const updatedStaff = state.staff.map((member) =>
          member.id === action.payload.id
            ? { ...member, current_attendance: action.payload.attendance ? 'Present' : 'Absent' }
            : member
        );
        state.staff = updatedStaff;
      });
  },
});

export default attendanceSlice.reducer;
