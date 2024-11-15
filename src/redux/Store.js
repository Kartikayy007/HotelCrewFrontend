import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import { adminReducer } from './slices/AdminSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'

export const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    admin: adminReducer,
    manager: ManagerReducer,
  },
})

export default store