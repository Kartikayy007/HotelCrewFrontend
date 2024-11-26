import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL for fetching and updating shifts
const FETCH_SHIFTS_URL = 'http://13.200.191.108:8000/api/edit/schedule_list/';
const UPDATE_SHIFT_URL = 'http://13.200.191.108:8000/api/edit/schedule_change'; // Assuming this is the update shift API

// Utility to get auth headers
const getAuthHeaders = () => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MTg3MDQ2LCJpYXQiOjE3MzI1OTUwNDYsImp0aSI6Ijc1Y2Q2MzZkYTk5MTQ5ZWFiMjA2ZjBlNjZhODMwZTY2IiwidXNlcl9pZCI6MTA5fQ.xIQKLkKU6TMTbqBlw8f4GGxhpWJt6U9FA7RVfMPGSwQ'


  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    Authorization: `Bearer ${token}`,
    
  };
};

// Async thunk to fetch shifts
export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(FETCH_SHIFTS_URL, {
        headers: getAuthHeaders(),
      });
      console.log(response);
      console.log(response.data.schedule_list);
      return response.data.schedule_list; // Extract the schedule_list array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch shifts.'
      );
    }
  }
);

// Async thunk to update a shift
export const updateShift = createAsyncThunk(
    'shifts/updateShift',
    async ({ userId, shift }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `${UPDATE_SHIFT_URL}/${userId}/`,  // Assuming userId is part of the URL or request body
          { shift },
          {
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'application/json'  // Add Content-Type header here
            }
          }
        );
        return response.data; // Return response data which contains message, user_id, and new_shift
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.detail || 'Failed to update shift.'
        );
      }
    }
  );
  

const shiftSlice = createSlice({
  name: 'shifts',
  initialState: {
    scheduleList: [], // Stores the list of shifts
    loading: false,   // Loading state for fetch operation
    error: null,      // Error state
    updateLoading: false,  // Loading state for update operation
    updateError: null,     // Error state for update operation
    updatedShift: null,    // Stores the updated shift information
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch shifts actions
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        console.log("Fetched Data:", action.payload);
        state.loading = false;
        state.scheduleList = action.payload; // Update the state with fetched data
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Capture the error message
      })

      // Update shift actions
      .addCase(updateShift.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null; // Clear any previous errors
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updatedShift = action.payload.new_shift; // Store the updated shift
        state.scheduleList = state.scheduleList.map((shift) =>
          shift.user_id === action.payload.user_id
            ? { ...shift, shift: action.payload.new_shift }
            : shift
        ); // Update the shift in the schedule list
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload; // Capture the error message for update
      });
  },
});

export default shiftSlice.reducer;
