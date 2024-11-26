import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



// Get authorization headers
const getAuthHeaders = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MjY4MTQ3LCJpYXQiOjE3MzE2NzYxNDcsImp0aSI6IjUyZTJkNDc4NTYxYzRhMmM4ZGIxNDRmMjVkZWYxMjJmIiwidXNlcl9pZCI6NDV9.p4LuZecKhv6K5dVs-9f1lNFxprEdi-_j7wcoR4Zbscs'; // Retrieve token dynamically
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (userDetails, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          'http://13.200.191.108:8000/api/edit/user_profile/', 
          userDetails, 
          {
            headers: getAuthHeaders(), 
          }
        );
        return response.data.user; // Return updated user details from API response
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error updating profile');
      }
    }
  );
  

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: {},
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Set the updated user details
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

export default profileSlice.reducer;