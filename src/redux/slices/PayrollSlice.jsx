import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hotelcrew-1.onrender.com/api/pay/';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

export const createWallet = createAsyncThunk(
  'payroll/createWallet',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`https://hotelcrew-1.onrender.com/api/pay/wallet/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getWallets = createAsyncThunk(
  'payroll/getWallets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`https://hotelcrew-1.onrender.com/api/pay/wallet/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const makeTransaction = createAsyncThunk(
  'payroll/makeTransaction',
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(`${BASE_URL}/transaction/`, transactionData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkWallet = createAsyncThunk(
  'payroll/checkWallet',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_URL}wallet/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const PayrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    wallets: [],
    loading: false,
    error: null,
    transactions: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets.push(action.payload);
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWallets.fulfilled, (state, action) => {
        state.wallets = action.payload;
      })
      .addCase(makeTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      });
  }
});

export default PayrollSlice.reducer;