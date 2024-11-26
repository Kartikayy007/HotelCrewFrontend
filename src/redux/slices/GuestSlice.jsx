import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://13.200.191.108:8000/api/hoteldetails/room-stats/'; // Replace with your actual API endpoint

const getAuthHeaders = () => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MTg3MDQ2LCJpYXQiOjE3MzI1OTUwNDYsImp0aSI6Ijc1Y2Q2MzZkYTk5MTQ5ZWFiMjA2ZjBlNjZhODMwZTY2IiwidXNlcl9pZCI6MTA5fQ.xIQKLkKU6TMTbqBlw8f4GGxhpWJt6U9FA7RVfMPGSwQ';


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

export default guestSlice.reducer;
