
// checkoutSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  if (!token) throw new Error('Authentication token not found');
  return token;
}

export const checkoutGuest = createAsyncThunk(
  'checkout/checkoutGuest',
  async (guestId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `https://hotelcrew-1.onrender.com/api/hoteldetails/checkout/${guestId}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Checkout failed');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    loading: false,
    error: null,
    checkoutData: null
  },
  reducers: {
    resetCheckout: (state) => {
      state.loading = false;
      state.error = null;
      state.checkoutData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(checkoutGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;