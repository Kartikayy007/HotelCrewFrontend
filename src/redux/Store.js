import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'
import AttendanceReducer from './slices/AttendanceSlice.jsx'
import TaskReducer from'./slices/TaskSlice.jsx'
import announcementReducer from './slices/AnnouncementSlice'
import shiftReducer from './slices/ShiftSlice.jsx'
export const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    manager: ManagerReducer,
    attendance: AttendanceReducer,
    task: TaskReducer,
    announcements: announcementReducer,
    shifts: shiftReducer,
  },
})

export default store