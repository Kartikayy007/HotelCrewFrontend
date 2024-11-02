import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'

export const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
  },
})

export default store