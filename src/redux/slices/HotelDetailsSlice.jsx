import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  if (!token) throw new Error('Authentication token not found');
  return token;
}

export const fetchHotelDetails = createAsyncThunk(
  'hotelDetails/fetchHotelDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get('https://hotelcrew-1.onrender.com/api/edit/view_hoteldetails/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.hotel_details;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const hotelDetailsSlice = createSlice({
  name: 'hotelDetails',
  initialState: {
    details: null,
    loading: false,
    error: null,
    totalRooms: 0,
    availableRooms: 0
  },
  reducers: {
    updateAvailableRooms: (state, action) => {
      state.availableRooms = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHotelDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
        state.totalRooms = action.payload.total_number_of_rooms || 0;
        state.availableRooms = action.payload.total_number_of_rooms || 0;
      })
      .addCase(fetchHotelDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateAvailableRooms } = hotelDetailsSlice.actions;
export default hotelDetailsSlice.reducer;

export const selectTotalRooms = (state) => state.hotelDetails.totalRooms;
export const selectAvailableRooms = (state) => state.hotelDetails.availableRooms;
export const selectHotelDetails = (state) => state.hotelDetails.details;
export const selectHotelLoading = (state) => state.hotelDetails.loading;
export const selectHotelError = (state) => state.hotelDetails.error;