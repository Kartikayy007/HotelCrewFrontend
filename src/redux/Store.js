import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'
import StaffReducer from './slices/StaffSlice.jsx'
import AttendanceReducer from './slices/AttendanceSlice.jsx'
import TaskReducer from'./slices/TaskSlice.jsx'
import announcementReducer from './slices/AnnouncementSlice'
export const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    manager: ManagerReducer,
    staff: StaffReducer,
    attendance: AttendanceReducer,
    task: TaskReducer,
    announcements: announcementReducer
  },
})

export default store