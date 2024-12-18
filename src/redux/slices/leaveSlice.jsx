import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://hotelcrew-1.onrender.com/api/attendance"; // Replace with your actual API base URL

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("token");


    if (!token) {
      throw new Error("Authentication token not found");
    }
  
    return {
      Authorization: `Bearer ${token}`, // Return the headers with the token
    };
  };
// **Async Thunks**

// Fetch all leave requests
export const fetchLeaveRequests = createAsyncThunk(
  "leave/fetchLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/attendance/leave_list/',
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching leave requests");
    }
  }
);

// Fetch leave count for a specific date
export const fetchLeaveCount = createAsyncThunk(
  "leave/fetchLeaveCount",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leave_count/`, {
        params: { date },
        headers: getAuthHeaders(),
      });
      console.log("leave",response.data.data)
      return response.data.data; // Assuming "data" contains the leave count
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching leave count");
    }
  }
);

// Update leave status
export const updateLeaveStatus = createAsyncThunk(
  "leave/updateLeaveStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://hotelcrew-1.onrender.com/api/attendance/leave_approve/${id}/`,
        { status }, // Send status as-is (capitalized)
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating leave status");
    }
  }
);

// **Slice**
const leaveSlice = createSlice({
    name: "leave",
    initialState: {
      leaveRequests: [], // List of all leave requests
      leaveCount: null,  // Leave count for a specific date
      leaveLoading: false, // Loading state for leave-related actions
      leaveError: null,    // Error state for leave-related actions
      updateStatus: null,  // Status message for updating leave request
    },
    reducers: {
      clearUpdateStatus: (state) => {
        state.updateStatus = null;
      },
      clearError: (state) => {
        state.leaveError = null;
      },
    },
    extraReducers: (builder) => {
      // Fetch Leave Requests
      builder
        .addCase(fetchLeaveRequests.pending, (state) => {
          state.leaveLoading = true;
          state.leaveError = null;
        })
        .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
          state.leaveLoading = false;
          state.leaveRequests = action.payload; // API returns array directly
          console.log('Updated state:', state.leaveRequests);
        })
        .addCase(fetchLeaveRequests.rejected, (state, action) => {
          state.leaveLoading = false;
          state.leaveError = action.payload?.message || 'Failed to fetch leave requests';
        });
  
      // Fetch Leave Count
      builder
        .addCase(fetchLeaveCount.pending, (state) => {
          state.leaveLoading = true;
          state.leaveError = null;
        })
        .addCase(fetchLeaveCount.fulfilled, (state, action) => {
          state.leaveLoading = false;
          console.log("P",action.payload.leave_count);
          state.leaveCount = action.payload.leave_count;
        })
        .addCase(fetchLeaveCount.rejected, (state, action) => {
          state.leaveLoading = false;
          state.leaveError = action.payload;
        });
  
      // Update Leave Status
      builder
        .addCase(updateLeaveStatus.pending, (state) => {
          state.leaveLoading = true;
          state.leaveError = null;
        })
        .addCase(updateLeaveStatus.fulfilled, (state, action) => {
          state.leaveLoading = false;
          console.log(action.payload.message);
          state.updateStatus = action.payload.message;
        })
        .addCase(updateLeaveStatus.rejected, (state, action) => {
          state.leaveLoading = false;
          state.leaveError = action.payload;
        });
    },
  });
  
  // Actions
  export const selectLeaveRequests = (state) => state.leave.leaveRequests; // List of all leave requests
export const selectLeaveCount = (state) => state.leave.leaveCount; // Leave count for a specific date
export const selectLeaveLoading = (state) => state.leave.leaveLoading; // Loading state
export const selectLeaveError = (state) => state.leave.leaveError; // Error state
export const selectUpdateStatus = (state) => state.leave.updateStatus; // Status
  export const { clearUpdateStatus, clearError } = leaveSlice.actions;
  
  // Reducer
  export default leaveSlice.reducer;

const handleApprove = async (requestId) => {
  try {
    const result = await dispatch(updateLeaveStatus({ 
      id: requestId, 
      status: 'Approved'  // Keep capitalized
    })).unwrap();
    
    setSnackbar({
      open: true,
      message: result.message,
      severity: 'success',
    });
    
    // Refresh leave requests after successful update
    dispatch(fetchLeaveRequests());
    handleCloseModal();
  } catch (err) {
    setSnackbar({
      open: true,
      message: err.message || 'Failed to approve leave request',
      severity: 'error',
    });
  }
};

const handleReject = async (requestId) => {
  try {
    const result = await dispatch(updateLeaveStatus({ 
      id: requestId, 
      status: 'Rejected'  // Keep capitalized
    })).unwrap();
    
    setSnackbar({
      open: true,
      message: result.message,
      severity: 'error',
    });

    // Refresh leave requests after successful update
    dispatch(fetchLeaveRequests());
    handleCloseModal();
  } catch (err) {
    setSnackbar({
      open: true,
      message: err.message || 'Failed to reject leave request',
      severity: 'error',
    });
  }
};
