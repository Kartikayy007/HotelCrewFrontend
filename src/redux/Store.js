import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'
import StaffReducer from './slices/StaffSlice.jsx'
import AttendanceReducer from './slices/AttendanceSlice.jsx'
import TaskReducer from'./slices/TaskSlice.jsx'
import taskReducer from './slices/StaffTaskSlice.jsx'
import announcementReducer from './slices/AnnouncementSlice.jsx'
import leaveReducer from './slices/StaffLeaveSlice.jsx'
import attendanceReducer from './slices/StaffAttendanceSlice.jsx'
import staffProfileReducer from './slices/StaffProfileSlice.jsx'

import shiftReducer from './slices/ShiftSlice.jsx'
import leaveReducer from './slices/LeaveSlice.jsx'
import guestReducer from './slices/GuestSlice.jsx';


export const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    manager: ManagerReducer,
    staff: StaffReducer,
    attendance: AttendanceReducer,
    staffAttendance: attendanceReducer,
    tasks: TaskReducer,
    stafftasks:taskReducer,
    announcements: announcementReducer,
    leave: leaveReducer,
    staffProfile: staffProfileReducer,,
    shifts: shiftReducer,
    leave: leaveReducer,
    guest: guestReducer,
  },
})

export default store