
import { createSlice } from '@reduxjs/toolkit';
import MDashboard from '../../components/Manager/MDashboard';
const managerSlice = createSlice({
  name: 'manager',
  initialState: {
    currentComponent: 'MDashboard', 
  },
  reducers: {
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    },
  },
});

export const { setCurrentComponent } = managerSlice.actions;
export default managerSlice.reducer;
