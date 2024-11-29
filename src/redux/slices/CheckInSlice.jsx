import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateAvailableRooms } from './HotelDetailsSlice';


const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Async thunk to fetch check-ins
export const fetchCheckIns = createAsyncThunk(
  'checkIns/fetchCheckIns',
  async (_, { dispatch, rejectWithValue }) => {
    try {

      const token = getAuthToken();

      const response = await axios.get('https://hotelcrew-1.onrender.com/api/hoteldetails/checkins/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log('Fetched check-ins:', response.data);
      const occupiedRooms = response.data.length;
      dispatch(updateAvailableRooms(occupiedRooms));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

// Async thunk to book a room
export const bookRoom = createAsyncThunk(
  'checkIns/bookRoom',
  async (bookingData, { dispatch, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/hoteldetails/book/',
        bookingData,  // Request body
        {
          headers: {  // Headers as the third argument
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      dispatch(fetchCheckIns());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const checkInSlice = createSlice({
  name: 'checkIns',
  initialState: {
    checkIns: [],
    loading: false,
    error: null,
    occupiedRooms: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckIns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCheckIns.fulfilled, (state, action) => {
        state.loading = false;
        state.checkIns = action.payload;
        state.occupiedRooms = action.payload.length;
      })
      .addCase(fetchCheckIns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookRoom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default checkInSlice.reducer;

// Selectors
export const selectOccupiedRooms = (state) => state.checkIns.occupiedRooms;
export const selectCheckIns = (state) => state.checkIns.checkIns;
export const selectCheckInsLoading = (state) => state.checkIns.loading;
export const selectCheckInsError = (state) => state.checkIns.error;