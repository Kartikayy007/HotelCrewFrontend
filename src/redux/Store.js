// store.js
import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import { adminReducer } from './slices/AdminSlice'
import { receptionReducer } from './slices/ReceptionSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'
import AdminAttendanceSlice from './slices/AdminAttendanceSlice'
import taskReducer from './slices/TaskSlice'
import announcementReducer from './slices/AnnouncementSlice'

const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    admin: adminReducer,
    manager: ManagerReducer,
    reception: receptionReducer,
    attendance: AdminAttendanceSlice,
    tasks: taskReducer,
    announcements: announcementReducer
  },
})

export default store