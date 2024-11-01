import { configureStore } from '@reduxjs/toolkit';
// import signupSlice from './slices/SignupSlice';
import UserReducer from './slices/UserSlice';

export const store = configureStore({
  reducer: {
    user: UserReducer,
  },
});

export default store;