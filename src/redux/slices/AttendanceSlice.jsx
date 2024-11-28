import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const FETCH_ATTENDANCE_URL = 'https://hotelcrew-1.onrender.com/api/attendance/list/';
const UPDATE_ATTENDANCE_URL = 'https://hotelcrew-1.onrender.com/api/attendance/change';
const FETCH_ATTENDANCE_STATS_URL = 'https://hotelcrew-1.onrender.com/api/attendance/stats/'; 
const CHECK_ATTENDANCE_URL = 'https://hotelcrew-1.onrender.com/api/attendance/check/'; 

// const api = axios.create({
//   baseURL: 'https://hotelcrew-1.onrender.com',
// });
// localStorage.setItem('accessToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MjY4MTQ3LCJpYXQiOjE3MzE2NzYxNDcsImp0aSI6IjUyZTJkNDc4NTYxYzRhMmM4ZGIxNDRmMjVkZWYxMjJmIiwidXNlcl9pZCI6NDV9.p4LuZecKhv6K5dVs-9f1lNFxprEdi-_j7wcoR4Zbscs')


const getAuthHeaders = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1MjM5LCJpYXQiOjE3MzI2MTMyMzksImp0aSI6ImUwMzMyNjRkYjk0OTQ5YzI5YjNhM2EzNjgxZGZhNDUzIiwidXNlcl9pZCI6MTIwfQ.ITV01RFPWCfFAVu6YJWZqjRCExMYpMw8DKf3xAvzL0w';

  if (!token) {
    throw new Error("Authentication token not found");
  }
8
  return {
    Authorization: `Bearer ${token}`, // Return the headers with the token
  };
};




export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async () => {
    const response = await axios.get(FETCH_ATTENDANCE_URL, {
      headers: getAuthHeaders(),
    });
    console.log(response.data);
    return response.data;
    
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async (id) => {
    const response = await axios.post(
      `${UPDATE_ATTENDANCE_URL}/${id}/`,
      {},
      { headers: getAuthHeaders() }
    );
    console.log(response.data);
    console.log("updated")
    return { id, ...response.data };
  }
);
export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchAttendanceStats',
  async () => {
    const response = await axios.get(FETCH_ATTENDANCE_STATS_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }
);
export const checkAttendance = createAsyncThunk(
  'attendance/checkAttendance',
  async (date) => {
    const response = await axios.get(`${CHECK_ATTENDANCE_URL}?date=${date}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }
);


const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    staff: [],
    stats: {
      totalCrew: 0,
      totalPresent: 0,
      daysWithRecordsThisMonth: 0,
      totalPresentMonth: 0,
    },
    attendanceCheck: null,
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
      })
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalCrew: action.payload.total_crew,
          totalPresent: action.payload.total_present,
          daysWithRecordsThisMonth: action.payload.days_with_records_this_month,
          totalPresentMonth: action.payload.total_present_month,
        };
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  
  .addCase(checkAttendance.pending, (state) => {
    state.loading = true;
    state.attendanceCheck = null; // Reset attendance check state
    state.error = null;
  })
  .addCase(checkAttendance.fulfilled, (state, action) => {
    state.loading = false;
    state.attendanceCheck = action.payload; // Store the attendance check result
  })
  .addCase(checkAttendance.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  });
},
});

export default attendanceSlice.reducer;
