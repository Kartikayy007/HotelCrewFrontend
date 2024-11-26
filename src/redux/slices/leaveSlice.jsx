import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchLeaveRequests', 
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch('https://hotelcrew-1.onrender.com/api/attendance/leave_list/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch leave requests');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Leave Status Thunk
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus', 
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`https://hotelcrew-1.onrender.com/api/attendance/leave_approve/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update leave status');
      }

      const data = await response.json();
      return { id, status, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave', 
  initialState: {
    requests: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      .addCase(updateLeaveStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const request = state.requests.find(req => req.id === id);
        
        if (request) {
          request.status = status;
        }
        
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default leaveSlice.reducer;