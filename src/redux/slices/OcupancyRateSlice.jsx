// src/redux/slices/OccupancyRateSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://hotelcrew-1.onrender.com/api/hoteldetails/all-rooms/';

const getAuthToken = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MjA1NDQ5LCJpYXQiOjE3MzI2MTM0NDksImp0aSI6Ijc5YzAzNWM4YTNjMjRjYWU4MDlmY2MxMWFmYTc2NTMzIiwidXNlcl9pZCI6OTB9.semxNFVAZZJreC9NWV7N0HsVzgYxpVG1ysjWG5qu8Xs';
  if (!token) throw new Error('No auth token available');
  return token;
};

export const fetchRoomStats = createAsyncThunk(
  'occupancy/fetchRoomStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const { rooms_occupied, available_rooms } = response.data;

      if (typeof rooms_occupied !== 'number' || typeof available_rooms !== 'number') {
        throw new Error('Invalid response format');
      }

      return {
        rooms_occupied,
        available_rooms
      };
    } catch (error) {
      console.error('Room stats fetch error:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch room stats');
    }
  }
);

const initialState = {
  occupiedRooms: 0,
  availableRooms: 0,
  loading: false,
  error: null,
  lastUpdated: null,
  totalRooms: 0
};

const occupancySlice = createSlice({
  name: 'occupancy',
  initialState,
  reducers: {
    resetOccupancy: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomStats.fulfilled, (state, action) => {
        state.loading = false;
        state.occupiedRooms = action.payload.rooms_occupied;
        state.availableRooms = action.payload.available_rooms;
        state.totalRooms = action.payload.rooms_occupied + action.payload.available_rooms;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchRoomStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  }
});

// Selectors with error handling
export const selectOccupiedRooms = (state) => state.occupancy?.occupiedRooms ?? 0;
export const selectAvailableRooms = (state) => state.occupancy?.availableRooms ?? 0;
export const selectOccupancyLoading = (state) => state.occupancy?.loading ?? false;
export const selectOccupancyError = (state) => state.occupancy?.error ?? null;
export const selectTotalRooms = (state) => state.occupancy?.totalRooms ?? 0;
export const selectLastUpdated = (state) => state.occupancy?.lastUpdated ?? null;

export const { resetOccupancy } = occupancySlice.actions;
export default occupancySlice.reducer;