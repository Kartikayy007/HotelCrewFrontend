import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";

// Add action
export const setAuthTokens = createAction('user/setAuthTokens');

export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async ({email, otp}, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/register/",
        { email, otp: otp.toString() },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      // Store only tokens in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'OTP verification failed' });
    }
  }
);

export const resendOtp = createAsyncThunk(
  "otp/resendOtp",
  async (userCredentials, {rejectWithValue}) => {
    try {
       ("Sending payload:", userCredentials);

      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/registrationOTP/",
        userCredentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

       ("Response:", response.data);
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({
          message:
            "Network error. Please check your internet connection and try again.",
        });
      } else {
        return rejectWithValue(
          error.response?.data || {message: "Failed to resend OTP"}
        );
      }
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
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
        state.error = action.payload?.message || "Invalid OTP";
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
        state.error = action.payload?.message || "Failed to resend OTP";
      });
  },
});

export default otpSlice.reducer;
