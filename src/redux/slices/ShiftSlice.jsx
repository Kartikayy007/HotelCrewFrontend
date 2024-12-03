import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL for fetching and updating shifts
const FETCH_SHIFTS_URL = 'https://hotelcrew-1.onrender.com/api/edit/schedule_list/';
const UPDATE_SHIFT_URL = 'https://hotelcrew-1.onrender.com/api/edit/schedule_change'; // Assuming this is the update shift API

// Utility to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');


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
       (response);
       (response.data.schedule_list);
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
        `${UPDATE_SHIFT_URL}/${userId}/`, // Assuming userId is part of the URL or request body
        { shift },
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json', // Add Content-Type header here
          },
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

const initialState = {
  scheduleList: [],
  loading: false,
  error: null,
};

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.scheduleList = action.payload;
        state.loading = false;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
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

export const selectScheduleList = (state) => state.shifts.scheduleList;
export const selectShiftsLoading = (state) => state.shifts.loading;
export const selectShiftsError = (state) => state.shifts.error;

export default shiftsSlice.reducer;
