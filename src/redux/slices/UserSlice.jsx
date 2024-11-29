import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({userCredentials, rememberMe}, { rejectWithValue }) => {
    try {
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
      const storageMethod = rememberMe ? localStorage : sessionStorage;

      // Store complete user data
      const userData = {
        role: response.role,
        ...response.user_data
      };

      storageMethod.setItem('token', response.access_token);
      storageMethod.setItem('refreshToken', response.refresh_token);
      storageMethod.setItem('user', JSON.stringify(userData)); 
      
      localStorage.removeItem('registrationStarted');
      localStorage.removeItem('otpVerified');
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({userCredentials,rememberMe}, { rejectWithValue }) => {
    try {
      const request = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/registrationOTP/",
        userCredentials,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const response = await request.data;
       (request)
      localStorage.setItem('registrationStarted', 'true');
      const storageMethod = rememberMe ? localStorage : sessionStorage;
      storageMethod.setItem('userEmail', userCredentials.email);
      localStorage.setItem(email, userCredentials.email);

      if(rememberMe)
        localStorage.setItem('rememberMe', true);
      
      localStorage.setItem('registrationStarted', 'true');
      storageMethod.setItem('userEmail', userCredentials.email);
      storageMethod.setItem('email', userCredentials.email);
      
      return response;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue({ message: 'Network error. Please check your internet connection and try again.' });
      } else {
        return rejectWithValue({ message: 'User with this E-mail already exists.' });
      }
    }
  }
);

export const completeMultiStepForm = createAsyncThunk(
  'user/completeMultiStepForm',
  async (formData, { rejectWithValue }) => {
    try {
      localStorage.setItem('multiStepCompleted', 'true');
      return formData;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to save hotel details' });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    error: null,
    loading: false,
    registrationStep: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.email = null;
      state.error = null;
      localStorage.clear();
      sessionStorage.clear();
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
        state.email = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.email = null;
        state.error = action.payload?.message || 'Login failed';
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.email = null;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(completeMultiStepForm.fulfilled, (state) => {
        state.registrationStep = 'completed';
      });
  },
});

export const { clearError, logout } = userSlice.actions;
export default userSlice.reducer;