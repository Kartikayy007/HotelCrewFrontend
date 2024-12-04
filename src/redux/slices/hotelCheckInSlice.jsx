import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const getAuthToken = () => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};
 
export const fetchTodayRevenue = createAsyncThunk(
  'hotelCheckin/fetchTodayRevenue',
  async (_, { rejectWithValue }) => {

    try {

      const token = getAuthToken();

      const response = await axios.get('https://hotelcrew-1.onrender.com/api/hoteldetails/book/');
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch revenue data');
    }
  }
);

// Async thunk for creating a new check-in
export const createCheckIn = createAsyncThunk(
  'hotelCheckin/createCheckIn',
  async (checkInData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://hotelcrew-1.onrender.com/api/hoteldetails/book/', checkInData);

       (response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create check-in');
    }
  }
);

const initialState = {
  todayRevenue: 0,
  checkIns: [],
  loading: false,
  error: null,
  lastUpdated: null
};

const hotelCheckInSlice = createSlice({
  name: 'hotelCheckIn',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTodayRevenue
      .addCase(fetchTodayRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayRevenue.fulfilled, (state, action) => {
        state.loading = false;
        // Calculate total revenue from all check-ins for today
        const todayCheckIns = action.payload.filter(checkin => {
          const checkinDate = new Date(checkin.check_in_time);
          const today = new Date();
          return (
            checkinDate.getDate() === today.getDate() &&
            checkinDate.getMonth() === today.getMonth() &&
            checkinDate.getFullYear() === today.getFullYear()
          );
        });
        
        state.checkIns = todayCheckIns;
        state.todayRevenue = todayCheckIns.reduce((total, checkin) => 
          total + parseFloat(checkin.price), 0
        );
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTodayRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch revenue data';
      })
      
      // Handle createCheckIn
      .addCase(createCheckIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        state.checkIns.push(action.payload.data);
        state.todayRevenue += parseFloat(action.payload.data.price);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create check-in';
      });
  }
});

// Selectors
export const selectTodayRevenue = (state) => state.hotelCheckIn.todayRevenue;
export const selectCheckIns = (state) => state.hotelCheckIn.checkIns;
export const selectLoading = (state) => state.hotelCheckIn.loading;
export const selectError = (state) => state.hotelCheckIn.error;
export const selectLastUpdated = (state) => state.hotelCheckIn.lastUpdated;

export const { clearError } = hotelCheckInSlice.actions;
export default hotelCheckInSlice.reducer;