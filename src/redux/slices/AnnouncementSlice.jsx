import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api/taskassignment/announcements/';

const getAuthToken = () => {
  // const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1MjM5LCJpYXQiOjE3MzI2MTMyMzksImp0aSI6ImUwMzMyNjRkYjk0OTQ5YzI5YjNhM2EzNjgxZGZhNDUzIiwidXNlcl9pZCI6MTIwfQ.ITV01RFPWCfFAVu6YJWZqjRCExMYpMw8DKf3xAvzL0w';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDExLCJpYXQiOjE3MzI2MTM0MTEsImp0aSI6ImI2MzkyNjAwNTU3ZDQ0YTQ5MWE5NTA4ZDlkN2M0OWM4IiwidXNlcl9pZCI6MTQ5fQ.8sZK2idIczWT3l-EAEmGWLGIKMaXwR5eOKXApDf_Kik';
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async (announcementData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(BASE_URL, announcementData, config);
      
      console.log(response)
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
      
      const response = await axios.get(BASE_URL, config);
      
      console.log(response.data)

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const URL = `${BASE_URL}${id}/`;

      console.log('Deleting announcement with ID:', id);
      const response = await axios.delete(URL, config);

      if (response.status === 204) {
        return id; 
      }

      throw new Error('Unexpected response status: ' + response.status);
    } catch (error) {
      console.error('Delete API error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to delete announcement'
      );
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcements',
  initialState: {
    announcements: [],
    loading: false,
    error: null,
    currentAnnouncement: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAnnouncement: (state, action) => {
      state.currentAnnouncement = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.push(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload.results;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.filter(
          announcement => announcement.id !== action.payload
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentAnnouncement } = announcementSlice.actions;

export const selectAllAnnouncements = state => state.announcements.announcements;
export const selectAnnouncementsLoading = state => state.announcements.loading;
export const selectAnnouncementsError = state => state.announcements.error;
export const selectCurrentAnnouncement = state => state.announcements.currentAnnouncement;

export default announcementSlice.reducer;