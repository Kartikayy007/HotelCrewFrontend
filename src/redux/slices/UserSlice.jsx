import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser=createAsyncThunk(
    'user/registerUser',
    async (userCredentials, { rejectWithValue }) => {
        try{
            console.log(userCredentials);
            const request = await axios.post(
                "https://hotelcrew-1.onrender.com/api/auth/register/",
                userCredentials,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
              const response = await request.data;

              const { tokens } = response;
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      console.log(response);
      return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Registration failed' });
          }
    }
);
const userSlice = createSlice({
    name: 'user',
  
    initialState: {
      email: null,
      error: null,
      loading: false,
    },
  
    reducers: {
      clearError: (state) => {
        state.error = null;
      }
    },
  
    extraReducers: (builder) => {
      builder
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
        });
    },
  });
  
  export default userSlice.reducer;