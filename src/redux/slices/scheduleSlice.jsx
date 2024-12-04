// scheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1NjU3NDk0LCJpYXQiOjE3MzMwNjU0OTQsImp0aSI6ImJmZDY4YzkxOGFjYTQ1MmFhNDRhZDNmY2EzNzc2ZDU2IiwidXNlcl9pZCI6MzEyfQ._g8wBkvMZQjLDn_TpEREshVKK-C8xqCy0tBUItwFXfU';
  // const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};



export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async () => {

    const token = getAuthToken();

    const response = await axios.get('https://hotelcrew-1.onrender.com/api/edit/schedule_list/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
     (response.data);
    return response.data.schedule_list;
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default scheduleSlice.reducer;