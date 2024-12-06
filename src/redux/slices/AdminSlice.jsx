import { createSlice } from '@reduxjs/toolkit';
import AdminDashboard from '../../components/admin/components/AdminDashboard';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    activeComponent: AdminDashboard
  },
  reducers: {
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    }
  }
});

export const { setActiveComponent } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;