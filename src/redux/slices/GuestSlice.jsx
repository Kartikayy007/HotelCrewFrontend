import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://hotelcrew-1.onrender.com/api/hoteldetails/room-stats/';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error("Authentication token not found");
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Initial state with proper structure
const initialState = {
    guest: {
        dates: [],
        checkins: [],
        checkouts: [],
        loading: false,
        error: null
    }
};

export const fetchGuestData = createAsyncThunk(
    'guestData/fetchGuestData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching guest data');
        }
    }
);

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGuestData.pending, (state) => {
                state.guest.loading = true;
                state.guest.error = null;
            })
            .addCase(fetchGuestData.fulfilled, (state, action) => {
                state.guest.loading = false;
                const { dates, daily_checkins, daily_checkouts } = action.payload;
                state.guest.dates = dates;
                state.guest.checkins = daily_checkins;
                state.guest.checkouts = daily_checkouts;
            })
            .addCase(fetchGuestData.rejected, (state, action) => {
                state.guest.loading = false;
                state.guest.error = action.payload;
            });
    },
});

// Updated selectors with null checks
export const selectDates = (state) => state.guest?.guest?.dates || [];
export const selectCheckins = (state) => state.guest?.guest?.checkins || [];
export const selectCheckouts = (state) => state.guest?.guest?.checkouts || [];
export const selectGuestLoading = (state) => state.guest?.guest?.loading || false;
export const selectGuestError = (state) => state.guest?.guest?.error || null;

export default guestSlice.reducer;
