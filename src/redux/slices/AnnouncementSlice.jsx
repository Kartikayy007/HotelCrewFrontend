import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api/taskassignment/announcements/day/';

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');

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
  'announcements/deleteAnnouncement',
  async (announcementId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      // Trim any whitespace and ensure proper URL formatting
      const cleanId = announcementId.toString().trim();
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.delete(
        `https://hotelcrew-1.onrender.com/api/taskassignment/announcements/${cleanId}/`,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Delete announcement error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.detail || 
        error.response?.data?.message ||
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
    currentAnnouncement: null,
    nextPage: null,
    previousPage: null,
    totalCount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAnnouncement: (state, action) => {
      state.currentAnnouncement = action.payload;
    },
    setPagination: (state, action) => {
      state.nextPage = action.payload.next;
      state.previousPage = action.payload.previous;
      state.totalCount = action.payload.count;
    },
    appendAnnouncements: (state, action) => {
      // Append new announcements to the existing array
      state.announcements = [...state.announcements, ...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = [action.payload, ...state.announcements];
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
          state.announcements = action.payload.results;
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
        // Remove deleted announcement from state
        state.announcements = state.announcements.filter(
          announcement => announcement.id.toString() !== action.meta.arg.toString()
        );
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentAnnouncement, setPagination,appendAnnouncements  } = announcementSlice.actions;

export const selectAllAnnouncements = state => state.announcements.announcements;
export const selectAnnouncementsLoading = state => state.announcements.loading;
export const selectAnnouncementsError = state => state.announcements.error;
export const selectCurrentAnnouncement = state => state.announcements.currentAnnouncement;
export const selectPagination = (state) => ({
  nextPage: state.announcements.nextPage,
  previousPage: state.announcements.previousPage,
  totalCount: state.announcements.totalCount,
});

export default announcementSlice.reducer;