
// import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
// import axios from "axios";

// const managerSlice = createSlice({
//   name: 'manager',
//   initialState: {
//     activeComponent: 'dashboard', // default component to render
//   },
//   reducers: {
//     setActiveComponent: (state, action) => {
//       state.activeComponent = action.payload;
//     },
//   },
// });

// export const { setActiveComponent } = managerSlice.actions;
// export default managerSlice.reducer;
// src/redux/slices/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const managerSlice = createSlice({
  name: 'manager',
  initialState: {
    isSidebarOpen: false,
    currentComponent: 'Dashboard', // Default component to display
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setCurrentComponent: (state, action) => {
      state.currentComponent = action.payload;
    },
  },
});

export const { toggleSidebar, setCurrentComponent } = managerSlice.actions;
export default managerSlice.reducer;
