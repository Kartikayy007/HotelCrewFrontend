// ReceptionSlice.tsx
import { createSlice } from '@reduxjs/toolkit';
import Dashboard from '../../components/receptionist/components/Dashboard'; 

const receptionSlice = createSlice({
  name: 'reception',
  initialState: {
    activeComponent: Dashboard
  },
  reducers: {
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    }
  }
});

export const { setActiveComponent } = receptionSlice.actions;
export const receptionReducer = receptionSlice.reducer;