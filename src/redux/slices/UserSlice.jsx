import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser=createAsyncThunk(
    'user/registerUser',
    async (userCredentials, { rejectWithValue }) => {
        try{
            console.log("user Credentials :",userCredentials);
            const response = await axios.post(
                "https://hotelcrew-1.onrender.com/api/auth/registrationOTP/",
                userCredentials,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
              console.log(response.data);

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
      message: null, 
      email: null,
      error: null,
      loading: false,
    },
  
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      clearMessage: (state) => {
        state.message = null;
      }
    },
  
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.message = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false;
          state.message = action.payload.message;
          state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.loading = false;
          state.message = null;
          state.error = action.payload;
        });
    },
  });
  
  export default userSlice.reducer;