import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import { adminReducer } from './slices/AdminSlice'

export const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    admin: adminReducer,
  },
})

export default store