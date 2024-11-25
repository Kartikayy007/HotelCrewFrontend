// scheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTk5ODM1LCJpYXQiOjE3MzIwMDc4MzUsImp0aSI6ImYxYzFkODE1NTU3NTQzYjhiNWRlMzYzOTNmOTAxYThmIiwidXNlcl9pZCI6NjR9.dxiN8N9Cf7EWpg33MgjluaCfemeRxMytdD613bDhzWc';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};


export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async () => {

    const token = getAuthToken();

    const response = await axios.get('http://13.200.191.108:8000/api/edit/schedule_list/', {
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