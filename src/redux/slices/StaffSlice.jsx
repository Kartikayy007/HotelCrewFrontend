import { createSlice } from '@reduxjs/toolkit';
import SDashboard from '../../components/Staff/StaffComponents/SDashboard';
const staffSlice = createSlice({
  name: 'manager',
  initialState: {
    currentComponent: 'SDashboard', 
  },
  reducers: {
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    },
  },
});

export const { setCurrentComponent } = staffSlice.actions;
export default staffSlice.reducer;