import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const payload = {
        email: email,
        otp: otp.toString() 
      };
      
      console.log('Sending payload:', payload);
      
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/register/",
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Invalid OTP' });
    }
  }
);

export const resendOtp = createAsyncThunk(
  'otp/resendOtp',
  async (userCredentials, { rejectWithValue }) => {
    try {
      console.log('Sending payload:', userCredentials);
      
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/registrationOTP/",
        userCredentials,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to resend OTP' });
    }
  }
);

const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    loading: false,
    error: null,
    otpVerified: false,
    otpResent: false,
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
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpResent = false;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpResent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to resend OTP';
      });
  },
});

export default otpSlice.reducer;