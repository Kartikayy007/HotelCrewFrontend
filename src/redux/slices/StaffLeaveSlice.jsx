// leaveSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const getAuthToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error('Authentication token not found');
    }
    return token;
  };

  
// Thunk to apply leave
export const staffLeaveApply = createAsyncThunk(
  'leavestaff/staffLeaveApply',
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
  'leavestaff/getStaffLeaveHistory',
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
       (response.data); // Log the data for debugging
      return response.data; // Return the response data on success
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave history'); // Handle errors gracefully
    }
  }
);


const leaveSlice = createSlice({
  name: 'leavestaff',
  initialState: {
    leaveHistory: [],   // Stores the leave history
    leaveStatus: '',    // Stores the leave status message
    applyLeaveError: null, // Error state for leave application
    applyLeaveLoading: false, // Loading state for leave application
    fetchHistoryError: null,  // Error state for fetching leave history
    fetchHistoryLoading: false,   // Loading state for async operations
  },
  reducers: {
    resetApplyLeaveError: (state) => {
      state.applyLeaveError = null;
      state.applyLeaveLoading = false;
    },
    resetLeaveStatus: (state) => {
      state.leaveStatus = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the leave apply request
      .addCase(staffLeaveApply.pending, (state) => {
        state.applyLeaveLoading = true;
        state.applyLeaveError = null;
      })
      .addCase(staffLeaveApply.fulfilled, (state, action) => {
        state.applyLeaveLoading = false;
         (action.payload.message)
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
export const selectLeaveHistory = (state) => state.leavestaff.leaveHistory;
export const selectLeaveStatus = (state) => state.leavestaff.leaveStatus;
export const selectApplyLeaveError = (state) => state.leavestaff.applyLeaveError;
export const selectApplyLeaveLoading = (state) => state.leavestaff.applyLeaveLoading;
export const selectFetchHistoryError = (state) => state.leavestaff.fetchHistoryError;
export const selectFetchHistoryLoading = (state) => state.leavestaff.fetchHistoryLoading;

export const { resetApplyLeaveError, resetLeaveStatus } = leaveSlice.actions;
export default leaveSlice.reducer;
