import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import { verifyOtp } from './OtpSlice';

export const registerUser=createAsyncThunk(
    'user/registerUser',
    async (userCredentials, { rejectWithValue }) => {
        try{
            console.log("user Credentials :",userCredentials);
            const response = await axios.post(
                "https://hotelcrew-1.onrender.com/api/auth/register/",
                userCredentials,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
              // const response = await request.data;
              console.log(response.data);
              const { tokens } = response.data;
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      // dispatch(verifyOtp(userCredentials.email));
      return response.data;
        }
        catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          return rejectWithValue(errorMessage);
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
          state.email = action.payload.user.email;
          state.error = null;
          // dispatch(verifyOtp(action.payload.email));
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.loading = false;
          state.email = null;
          state.error = action.payload;
        });
    },
  });
  
  export default userSlice.reducer;