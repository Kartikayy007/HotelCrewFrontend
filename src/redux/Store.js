import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import { adminReducer } from './slices/AdminSlice'
import { receptionReducer } from './slices/ReceptionSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'
import StaffReducer from './slices/StaffSlice.jsx'
import AdminAttendanceSlice from './slices/AdminAttendanceSlice'
import TaskReducer from './slices/TaskSlice'
import taskReducer from './slices/StaffTaskSlice.jsx'
import announcementReducer from './slices/AnnouncementSlice.jsx'
import staffleaveReducer from './slices/StaffLeaveSlice.jsx'
import attendanceReducer from './slices/StaffAttendanceSlice.jsx'
import staffProfileReducer from './slices/StaffProfileSlice.jsx'
import performanceReducer from './slices/StaffPerformanceSlice.jsx';
import shiftReducer from './slices/ShiftSlice.jsx'
import guestReducer from './slices/GuestSlice.jsx';


import staffReducer from "./slices/StaffSlice"
import hotelCheckInReducer from './slices/hotelCheckInSlice'
import revenueReducer from './slices/revenueSlice' 
import scheduleReducer from './slices/scheduleSlice';
import leaveReducer from './slices/leaveSlice';
import customerReducer from './slices/customerSlice';
import hotelDetailsReducer from './slices/HotelDetailsSlice'
import checkInReducer from './slices/CheckInSlice'
import occupancyReducer from './slices/OcupancyRateSlice';
import userProfileReducer from './slices/userProfileSlice'
import staffAttendanceReducer from './slices/StaffAttendanceSlice';
import checkoutReducer from './slices/checkoutSlice';
import adminstaffReducer from './slices/AdminStaffSlice.jsx';
import staffannouncementReducer from './slices/StaffAnnouncememt.jsx';

const store = configureStore({
  reducer: {

    user: UserReducer,
    otp: OtpReducer,
    admin: adminReducer,
    manager: ManagerReducer,
    staff: StaffReducer,
    attendance: attendanceReducer,
    staffAttendance: attendanceReducer,
    tasks: TaskReducer,
    stafftasks:taskReducer,
    announcements: announcementReducer,
    leavestaff: staffleaveReducer,
    staffProfile: staffProfileReducer,
    shifts: shiftReducer,
    leave: leaveReducer,
    guest: guestReducer,
    performance:performanceReducer,
    reception: receptionReducer,
    attendance: AdminAttendanceSlice,
    tasks: taskReducer,
    announcements: announcementReducer,
    staff: staffReducer,
    hotelCheckIn: hotelCheckInReducer,
    revenue: revenueReducer, 
    schedule: scheduleReducer,
    leave: leaveReducer,
    customers: customerReducer,
    hotelDetails: hotelDetailsReducer,
    checkIns: checkInReducer,
    occupancy: occupancyReducer,
    staffAttendance: staffAttendanceReducer,
    userProfile: userProfileReducer,
    checkout: checkoutReducer,
    adminstaff:adminstaffReducer,
    staffannouncement:staffannouncementReducer
  },
})

export default store;