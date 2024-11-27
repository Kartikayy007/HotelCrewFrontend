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
      console.log('Fetched hotel details:', response.data.hotel_details);
      return response.data.hotel_details;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// New async thunk for updating hotel details
export const updateHotelDetails = createAsyncThunk(
  'hotelDetails/updateHotelDetails',
  async (updateData, { rejectWithValue, dispatch }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put('https://hotelcrew-1.onrender.com/api/edit/hoteldetails/', 
        updateData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Dispatch fetchHotelDetails to refresh the details after update
      dispatch(fetchHotelDetails());
      
      return response.data.hotel;
    } catch (error) {
      console.error('Update hotel details error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New async thunk for mass creating staff
export const massCreateStaff = createAsyncThunk(
  'hotelDetails/massCreateStaff',
  async (formData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      console.log('Sending staff excel sheet...');
      
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/edit/mass-create/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Staff upload error:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
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
    availableRooms: 0,
    updateLoading: false,
    updateError: null
  },
  reducers: {
    updateAvailableRooms: (state, action) => {
      state.availableRooms = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotel details cases
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
      })
      
      // Update hotel details cases
      .addCase(updateHotelDetails.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateHotelDetails.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.details = action.payload;
      })
      .addCase(updateHotelDetails.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
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
export const selectHotelUpdateLoading = (state) => state.hotelDetails.updateLoading;
export const selectHotelUpdateError = (state) => state.hotelDetails.updateError;