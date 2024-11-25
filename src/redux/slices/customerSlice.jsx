// customerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MDY0NDY4LCJpYXQiOjE3MzI0NzI0NjgsImp0aSI6IjhlM2RmNDk5ZWRiZDRlNWRhNTBlNWFmNmEyMDE3YzFjIiwidXNlcl9pZCI6NzZ9.RHOCY0OHncrdSUhpGn8Bd2FtK3OAHhqjLebegI2w73w'

  if (!token) throw new Error('Authentication token not found');
  return token;
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {

    const token = getAuthToken();

    const { data } = await axios.get('http://hotelcrew-1.onrender.com/api/hoteldetails/all-customers/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Fetched customers:', data);
    return data;
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;