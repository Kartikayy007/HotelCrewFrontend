import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { verifyOtp } from './OtpSlice';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({userCredentials, rememberMe}, { rejectWithValue }) => {
    try {
       ('Login attempt with:', {
        email: userCredentials.email,
        rememberMe
      });

      const request = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/login/",
        userCredentials,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const response = await request.data;

      // Store auth data
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token || response.refress_token); // Handle typo in API
      localStorage.setItem('userData', JSON.stringify(response.user_data));
      localStorage.setItem('role', response.role);

      // Set hotel registration status
      const isHotelRegistered = response["hotel details"] !== "not registered";
      localStorage.setItem('isHotelRegistered', isHotelRegistered.toString());
      
      return {
        ...response,
        isHotelRegistered,
        userData: {
          role: response.role,
          ...response.user_data
        }
      };
    } catch (error) {
      console.error('Login Error:', error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
         ('Server Error Response:', error.response.data);
        
        // Return the exact error message from backend
        return rejectWithValue({
          message: error.response.data.message || error.response.data.detail || 'Server error occurred'
        });
      } else if (error.request) {
        // Request made but no response
         ('No Response Error:', error.request);
        return rejectWithValue({
          message: 'No response from server. Please check your connection.'
        });
      } else {
        // Request setup error
         ('Request Setup Error:', error.message);
        return rejectWithValue({
          message: error.message || 'Failed to make login request'
        });
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({userCredentials}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/registrationOTP/",
        userCredentials,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        
        if (errorData.non_field_errors) {
          return rejectWithValue({
            message: errorData.non_field_errors[0]
          });
        }

        if (errorData.email) {
          return rejectWithValue({
            message: errorData.email[0]
          });
        }

        if (errorData.message) {
          return rejectWithValue({
            message: errorData.message
          });
        }

        return rejectWithValue({
          message: "Registration failed"
        });
      }
      
      return rejectWithValue({
        message: "Network error"
      });
    }
  }
);

// UserSlice.jsx - Update completeMultiStepForm
export const completeMultiStepForm = createAsyncThunk(
  'user/completeMultiStepForm',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue({ message: 'No access token found' });
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'staff_excel_sheet' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key === 'room_types' || key === 'department_names') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/hoteldetails/register/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`
          },
        }
      );
      
      if (response.data.status === "success") {
        dispatch(setHotelRegistration(true));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue({ 
        message: error.response?.data?.message || 'Failed to save hotel details' 
      });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    role: localStorage.getItem('role'),
    userData: JSON.parse(localStorage.getItem('userData')) || null,
    isHotelRegistered: localStorage.getItem('isHotelRegistered') === 'true',
    email: null,
    username: null,
    error: null,
    loading: false,
    currentRegistrationStep: 1
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      localStorage.clear();
      return { ...userSlice.initialState };
    },
    setHotelRegistration: (state, action) => {
      state.isHotelRegistered = action.payload;
      localStorage.setItem('isHotelRegistered', action.payload);
    },
    setCurrentStep: (state, action) => {
      state.currentRegistrationStep = action.payload;
    },
    setAuthData: (state, action) => {
      const { token, refreshToken, userData, role } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.userData = userData;
      state.role = role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token || action.payload.refress_token;
        state.userData = action.payload.user_data;
        state.role = action.payload.role;
        state.error = null;
        state.isHotelRegistered = action.payload.isHotelRegistered;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.username = action.payload.user_name;
        state.isRegistrationStarted = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(completeMultiStepForm.fulfilled, (state) => {
        state.isHotelRegistered = true;
        localStorage.setItem('isHotelRegistered', 'true');
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.userData = action.payload.userData;
        state.role = action.payload.role;
        state.isOtpVerified = true;
        const isHotelRegistered = action.payload["hotel details"] !== "not registered";
        state.isHotelRegistered = isHotelRegistered;
        localStorage.setItem('isHotelRegistered', isHotelRegistered);
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.isOtpVerified = false;
      });
  }
});

export const { 
  clearError, 
  logout,  
  setUserEmail,
  setAuthData,
  setRegistrationStatus,
  setHotelRegistration,
  setCurrentStep
} = userSlice.actions;

export default userSlice.reducer;