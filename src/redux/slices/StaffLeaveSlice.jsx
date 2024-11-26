// leaveSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const getAuthToken = () => {
    // const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1MjM5LCJpYXQiOjE3MzI2MTMyMzksImp0aSI6ImUwMzMyNjRkYjk0OTQ5YzI5YjNhM2EzNjgxZGZhNDUzIiwidXNlcl9pZCI6MTIwfQ.ITV01RFPWCfFAVu6YJWZqjRCExMYpMw8DKf3xAvzL0w';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDExLCJpYXQiOjE3MzI2MTM0MTEsImp0aSI6ImI2MzkyNjAwNTU3ZDQ0YTQ5MWE5NTA4ZDlkN2M0OWM4IiwidXNlcl9pZCI6MTQ5fQ.8sZK2idIczWT3l-EAEmGWLGIKMaXwR5eOKXApDf_Kik';
    if (!token) {
      throw new Error('Authentication token not found');
    }
    return token;
  };

  
// Thunk to apply leave
export const staffLeaveApply = createAsyncThunk(
  'leave/staffLeaveApply',
  async (leaveData, { rejectWithValue }) => {
    try {
      const token = getAuthToken(); // Get the auth token
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/attendance/apply_leave/',
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      return response.data; // Returns the response data on success
    } catch (error) {
      return rejectWithValue(error.response.data); // Returns the error response on failure
    }
  }
);

// Thunk to fetch the staff's applied leaves
export const getStaffLeaveHistory = createAsyncThunk(
  'leave/getStaffLeaveHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken(); // Retrieve the auth token
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/attendance/apply_leave/',
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the headers
          },
        }
      );
      console.log(response.data); // Log the data for debugging
      return response.data; // Return the response data on success
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave history'); // Handle errors gracefully
    }
  }
);


const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leaveHistory: [],   // Stores the leave history
    leaveStatus: '',    // Stores the leave status message
    applyLeaveError: null, // Error state for leave application
    applyLeaveLoading: false, // Loading state for leave application
    fetchHistoryError: null,  // Error state for fetching leave history
    fetchHistoryLoading: false,   // Loading state for async operations
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the leave apply request
      .addCase(staffLeaveApply.pending, (state) => {
        state.applyLeaveLoading = true;
        state.applyLeaveError = null;
      })
      .addCase(staffLeaveApply.fulfilled, (state, action) => {
        state.applyLeaveLoading = false;
        console.log(action.payload.message)
        state.leaveStatus = action.payload.message; 
      })
      .addCase(staffLeaveApply.rejected, (state, action) => {
        state.applyLeaveLoading = false;
        state.applyLeaveError = action.payload.message;
      })

      // Handle the leave history request
      .addCase(getStaffLeaveHistory.pending, (state) => {
        state.fetchHistoryLoading = true;
      })
      .addCase(getStaffLeaveHistory.fulfilled, (state, action) => {
        state.fetchHistoryLoading = false;
        state.leaveHistory = action.payload.data; 
      })
      .addCase(getStaffLeaveHistory.rejected, (state) => {
        state.fetchHistoryLoading = false;
        state.fetchHistoryError = 'Failed to fetch leave history'; 
      });
  },
});

// Export the actions (if any)
export default leaveSlice.reducer;