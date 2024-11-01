import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://hotelcrew-1.onrender.com/api/auth/verifyOTP/", 
        { email, otp },
        { 
            headers: {
                'Content-Type': 'application/json'
              }       
         });
         console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ||  { message: 'Invalid OTP' });
    }
  }
);

const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    loading: false,
    error: null,
    otpVerified: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Invalid OTP';
  });
  },
});

export default otpSlice.reducer;