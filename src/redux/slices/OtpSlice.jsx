import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";

// Add action
export const setAuthTokens = createAction('user/setAuthTokens');

export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async ({email, otp}, { dispatch, rejectWithValue }) => {
    try {
      console.log('Verifying OTP for:', email);
      
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/register/",
        { email, otp: otp.toString() },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log('OTP verification response:', response.data);

      // Successful response handling
      if (response.data.access_token) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        
        // Create user data object
        const userData = {
          id: response.data.user_id,
          role: 'Admin',
          email: email
        };
        
        // Store user data
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('role', 'Admin');

        // Return success response
        return {
          status: "success",
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          role: 'Admin',
          userData: userData,
          "hotel details": response.data["hotel details"] || "not registered"
        };
      }
      
      // If no access token in response
      return rejectWithValue({ 
        message: 'Invalid response: No access token received' 
      });
      
    } catch (error) {
      console.error('OTP Verification Error:', error.response?.data);
      
      // If error response has error array
      if (error.response?.data?.error) {
        const errorMessage = Array.isArray(error.response.data.error) 
          ? error.response.data.error[0] 
          : error.response.data.error;
          
        return rejectWithValue({
          error: errorMessage // Changed from message to error to match API response
        });
      }
      
      // Default error
      return rejectWithValue({
        error: 'OTP verification failed'
      });
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
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpVerified = false;
        state.error = action.payload?.error; // Access error directly from payload
        console.error('OTP verification rejected:', action.payload);
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
