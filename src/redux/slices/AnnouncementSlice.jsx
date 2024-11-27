import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api/taskassignment/announcements/day/  ';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
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
      
      const formattedData = {
        title: announcementData.title,
        description: announcementData.description,
        department: announcementData.department === 'all' ? 'All' : announcementData.department,
        urgency: announcementData.urgency ? announcementData.urgency.charAt(0).toUpperCase() + announcementData.urgency.slice(1) : 'Normal',
        created_at: new Date().toISOString(), // Add current date
        assigned_to: announcementData.assigned_to || [] // Ensure assigned_to is always an array
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post('https://hotelcrew-1.onrender.com/api/taskassignment/announcements/', formattedData, config);
      return response.data;
    } catch (error) {
      console.error('Create announcement error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.detail || 
        error.response?.data?.message ||
        'Failed to create announcement'
      );
    }
  }
);

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAll',
  async (queryString = '', { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.get(
        `https://hotelcrew-1.onrender.com/api/taskassignment/announcements/${queryString}`, 
        config
      );
      
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

       ('Deleting announcement with ID:', id);
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
        if (action.payload.results) {
          state.announcements = [...state.announcements, ...action.payload.results];
        }
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