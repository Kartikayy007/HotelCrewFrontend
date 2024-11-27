import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Function to retrieve the authentication token
const getAuthToken = () => {
    const token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDExLCJpYXQiOjE3MzI2MTM0MTEsImp0aSI6ImI2MzkyNjAwNTU3ZDQ0YTQ5MWE5NTA4ZDlkN2M0OWM4IiwidXNlcl9pZCI6MTQ5fQ.8sZK2idIczWT3l-EAEmGWLGIKMaXwR5eOKXApDf_Kik'; // Replace with actual token
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
       'http://hotelcrew-1.onrender.com/api/edit/user_profile/', // API endpoint for fetching staff profile
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
          },
        }
      );
      console.log('Staff Profile:', response.data); // For debugging, log the response
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

// Slice to manage the staff profile state
const staffProfileSlice = createSlice({
  name: 'staffProfile', // Updated slice name to staffProfile
  initialState: {
    profile: null, // Initial state for the staff profile
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStaffProfile.pending, (state) => {
        state.loading = true; // Set loading to true while fetching data
        state.error = null;
      })
      .addCase(getStaffProfile.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false once data is fetched
        state.profile = action.payload; // Store the fetched staff profile data
      })
      .addCase(getStaffProfile.rejected, (state, action) => {
        state.loading = false; // Set loading to false when request fails
        state.error = action.payload; // Store error message in state
      });
  },
});

// Selectors to access the staff profile state
export const selectStaffProfile = (state) => state.staffProfile.profile;
export const selectStaffProfileLoading = (state) => state.staffProfile.loading;
export const selectStaffProfileError = (state) => state.staffProfile.error;

export default staffProfileSlice.reducer;

