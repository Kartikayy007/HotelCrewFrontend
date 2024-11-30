import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import { adminReducer } from './slices/AdminSlice'
import { receptionReducer } from './slices/ReceptionSlice'
import ManagerReducer from './slices/ManagerSlice.jsx'
import AdminAttendanceSlice from './slices/AdminAttendanceSlice'
import taskReducer from './slices/TaskSlice'
import announcementReducer from './slices/AnnouncementSlice'
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
import checkoutReducer from './slices/checkoutSlice'
import payrollReducer from './slices/PayrollSlice';

const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    admin: adminReducer,
    manager: ManagerReducer,
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
    payroll: payrollReducer
  },
})

export default store