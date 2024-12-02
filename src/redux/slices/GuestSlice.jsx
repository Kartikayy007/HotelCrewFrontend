import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://hotelcrew-1.onrender.com/api/hoteldetails/room-stats/'; // Replace with your actual API endpoint

const getAuthHeaders = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1NjU3NDk0LCJpYXQiOjE3MzMwNjU0OTQsImp0aSI6ImJmZDY4YzkxOGFjYTQ1MmFhNDRhZDNmY2EzNzc2ZDU2IiwidXNlcl9pZCI6MzEyfQ._g8wBkvMZQjLDn_TpEREshVKK-C8xqCy0tBUItwFXfU';


  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    Authorization: `Bearer ${token}`, // Return the headers with the token
  };
};

// Fetch attendance data from the API
export const fetchGuestData = createAsyncThunk(
  'guestData/fetchGuestData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(), // Include headers if necessary, like authorization
      });
      console.log(response.data);
      return response.data; // Assume it returns dates, checkins, checkouts
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching guest data');
    }
  }
);

// Slice for attendance data
const guestSlice = createSlice({
  name: 'guest',
  initialState: {
    dates: [],          // Array to hold dates (e.g., ['2024-11-18', '2024-11-19', ...])
    checkins: [],       // Check-in counts for each date
    checkouts: [],      // Check-out counts for each date
    guestloading: false,
    guesterror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuestData.pending, (state) => {
        state.guestloading = true;
        state.guesterror = null;
      })
      .addCase(fetchGuestData.fulfilled, (state, action) => {
        state.guestloading = false;
        const { dates, daily_checkins, daily_checkouts } = action.payload;
        state.dates = dates;
        state.checkins = daily_checkins;
        state.checkouts = daily_checkouts;
      })
      .addCase(fetchGuestData.rejected, (state, action) => {
        state.guestloading = false;
        state.guesterror = action.payload || 'Failed to fetch attendance data';
      });
  },
});

export const selectDates = (state) => state.guest.dates;
export const selectCheckins = (state) => state.guest.checkins;
export const selectCheckouts = (state) => state.guest.checkouts;
export const selectGuestLoading = (state) => state.guest.guestloading;
export const selectGuestError = (state) => state.guest.guesterror;

export default guestSlice.reducer;
