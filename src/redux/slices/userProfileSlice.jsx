// userProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token not found');
  return token;
}

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile', 
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        'https://hotelcrew-1.onrender.com/api/edit/user_profile/',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async (updateData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        'https://hotelcrew-1.onrender.com/api/edit/user_profile/',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectUserProfile = (state) => state.userProfile.profile;
export const selectUserProfileLoading = (state) => state.userProfile.loading;
export const selectUserProfileError = (state) => state.userProfile.error;

export default userProfileSlice.reducer;