import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
   const token  = localStorage.getItem('accessToken'); 
    if (!token) {
      throw new Error('Authentication token not found');
    }
    return token;
  };
  

// Thunk to fetch individual staff profile
export const getStaffProfile = createAsyncThunk(
  'staffProfile/getStaffProfile', // Updated slice name to staffProfile
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken(); // Retrieve auth token
      const response = await axios.get(
       'https://hotelcrew-1.onrender.com/api/edit/user_profile/', // API endpoint for fetching staff profile
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
          },
        }
      );
       ('Staff Profile:', response.data); // For debugging, log the response
      return response.data.user; // Return only the 'user' data from the response
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with an error
            console.error('Server error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network error:', error.message);
        } else {
            // Something else went wrong
            console.error('Error:', error.message);
        }
    //   console.error('Error fetching staff profile:', error); // Log error for debugging
      return rejectWithValue(error.response?.data || 'Failed to fetch staff profile');
    }
  }
);

export const updateStaffProfile = createAsyncThunk(
  'staffProfile/updateStaffProfile', // Slice name
  async (formData, { rejectWithValue }) => {
    try {
      const token = getAuthToken(); // Retrieve auth token
      const response = await axios.put(
        'https://hotelcrew-1.onrender.com/api/edit/user_profile/', // API endpoint for updating staff profile
        formData, // The updated user details
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
            'Content-Type': 'multipart/form-data',
          },
        }
      );
       ('Profile Updated:', response.data); // For debugging, log the response
      return response.data.user; // Return updated user details
    } catch (error) {
      if (error.response) {
        // The request was made, but the server responded with an error
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error:', error.message);
      } else {
        // Something else went wrong
        console.error('Error:', error.message);
      }
      return rejectWithValue(error.response?.data || 'Failed to update staff profile');
    }
  }
);


const initialState = {
    profile: null,
    user: null, 
    loading: false,
    error: null,
    successMessage: null
};

const staffProfileSlice = createSlice({
    name: 'staffProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStaffProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStaffProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Store in user field
                state.error = null;
            })
            .addCase(getStaffProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateStaffProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStaffProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.successMessage = 'Profile updated successfully.';
            })
            .addCase(updateStaffProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Update selectors to match state structure
export const selectStaffProfile = (state) => state.staffProfile?.user || null;
export const selectStaffProfileLoading = (state) => state.staffProfile?.loading || false;
export const selectStaffProfileError = (state) => state.staffProfile?.error || null;
export const selectStaffProfileSuccessMessage = (state) => state.staffProfile?.successMessage || null;

export default staffProfileSlice.reducer;
