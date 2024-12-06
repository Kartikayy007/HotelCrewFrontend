// src/redux/slices/RoomDetailsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RoomDetail {
  room_type: string;
  count: number;
  price: string;
}

interface RoomDetailsState {
  rooms: RoomDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomDetailsState = {
  rooms: [],
  loading: false,
  error: null,
};

const getAuthToken = () => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};


export const fetchRoomDetails = createAsyncThunk(
  'roomDetails/fetchRoomDetails',
  async () => {
    const token = getAuthToken();
    const response = await axios.get('https://hotelcrew-1.onrender.com/api/hoteldetails/room/details/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data.data);
    return response.data.data;
  }
);

const roomDetailsSlice = createSlice({
  name: 'roomDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRoomDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch room details';
      });
  },
});

export const selectRoomDetails = (state: RootState) => state.roomDetails.rooms;
export const selectRoomDetailsLoading = (state: RootState) => state.roomDetails.loading;
export const selectRoomDetailsError = (state: RootState) => state.roomDetails.error;

export default roomDetailsSlice.reducer;