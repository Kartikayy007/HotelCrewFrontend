  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import axios from 'axios';

  const BASE_URL = 'https://hotelcrew-1.onrender.com/api/taskassignment/announcements/';

  const getAuthToken = () => {
    const token = ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTc4MzMzLCJpYXQiOjE3MzE5ODYzMzMsImp0aSI6IjMxNjk0NTQzNWIzYTQ0MDBhM2MxOGE5M2UzZTk5NTQ0IiwidXNlcl9pZCI6NzF9.Dyl7m7KmXCrMvqbPo31t9q7wWcYgLHCNi9SNO6SPfrY';
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
        }
        await axios.delete(`${BASE_URL}${id}`, config);

        console.log(id)

        return id;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete announcement');
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
          state.announcements = action.payload;
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
            announcement => announcement._id !== action.payload
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