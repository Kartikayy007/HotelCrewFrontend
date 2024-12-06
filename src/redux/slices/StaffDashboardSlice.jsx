import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentComponent: 'SDashboard'
};

const staffDashboardSlice = createSlice({
  name: 'staffDashboard',
  initialState,
  reducers: {
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    }
  }
});

export const { setCurrentComponent } = staffDashboardSlice.actions;
export default staffDashboardSlice.reducer;