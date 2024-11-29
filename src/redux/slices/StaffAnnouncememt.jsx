import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api/taskassignment/announcements/';

const getAuthToken = () => {
  // const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1MjM5LCJpYXQiOjE3MzI2MTMyMzksImp0aSI6ImUwMzMyNjRkYjk0OTQ5YzI5YjNhM2EzNjgxZGZhNDUzIiwidXNlcl9pZCI6MTIwfQ.ITV01RFPWCfFAVu6YJWZqjRCExMYpMw8DKf3xAvzL0w';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MzgwMTYxLCJpYXQiOjE3MzI3ODgxNjEsImp0aSI6IjIzZmI3NjhlY2Y3MjQ4NzM4YjQ2NzMzZDBhY2M2YWFkIiwidXNlcl9pZCI6MTc4fQ.9HKA5XN7DddiStgpO318XkVbkatf_45g9-YlLpeWVbE';
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
  async (url = BASE_URL, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      
      const response = await axios.get(url, config);
      
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
  name: 'staffannouncements',
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
        // state.announcements = action.payload.results;
       
        state.announcements = [...state.announcements, ...action.payload.results];
        
        // Update pagination info
        state.nextPage = action.payload.next;
        state.previousPage = action.payload.previous;
        state.totalCount = action.payload.count;
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

export const { clearError, setCurrentAnnouncement, setPagination,appendAnnouncements  } = announcementSlice.actions;

export const selectAllAnnouncements = state => state.staffannouncements.announcements;
export const selectAnnouncementsLoading = state => state.staffannouncements.loading;
export const selectAnnouncementsError = state => state.staffannouncements.error;
export const selectCurrentAnnouncement = state => state.staffannouncements.currentAnnouncement;
export const selectPagination = (state) => ({
  nextPage: state.staffannouncements.nextPage,
  previousPage: state.staffannouncements.previousPage,
  totalCount: state.staffannouncements.totalCount,
});

export default announcementSlice.reducer;