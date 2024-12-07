import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './slices/UserSlice.jsx'
import OtpReducer from './slices/OtpSlice'
import { adminReducer } from './slices/AdminSlice'
import { receptionReducer } from './slices/ReceptionSlice'
import AdminStaffSlice from './slices/StaffSlice.jsx'
import ManagerReducer from './slices/ManagerSlice.jsx'
import AdminAttendanceSlice from './slices/AdminAttendanceSlice'
import managerAttendanceReducer from './slices/AttendanceSlice.jsx';
import taskReducer from './slices/TaskSlice'
import announcementReducer from './slices/AnnouncementSlice'
import staffReducer from "./slices/DashboardStaffSlice.jsx"
import hotelCheckInReducer from './slices/hotelCheckInSlice'
import revenueReducer from './slices/revenueSlice' 
import scheduleReducer from './slices/scheduleSlice'
import leaveReducer from './slices/LeaveSlice.jsx'
import customerReducer from './slices/customerSlice'
import hotelDetailsReducer from './slices/HotelDetailsSlice'
import checkInReducer from './slices/CheckInSlice'
import occupancyReducer from './slices/OcupancyRateSlice'
import userProfileReducer from './slices/userProfileSlice'
import staffAttendanceReducer from './slices/StaffAttendanceSlice'
import checkoutReducer from './slices/checkoutSlice'
import payrollReducer from './slices/PayrollSlice'
import shiftsReducer from './slices/ShiftSlice'
import staffProfileReducer from './slices/StaffProfileSlice'
import roomDetailsReducer from './slices/RoomDetailsSlice';
import staffDashboardReducer from './slices/StaffDashboardSlice';
import staffPerformanceReducer from './slices/StaffPerformanceSlice';
import leaveStaffReducer from './slices/StaffLeaveSlice';
import staffTasksReducer from './slices/StaffTaskSlice';

const store = configureStore({
  reducer: {
    user: UserReducer,
    otp: OtpReducer,
    admin: adminReducer,
    manager: ManagerReducer,
    reception: receptionReducer,
    attendance: AdminAttendanceSlice,
    managerAttendance: managerAttendanceReducer,
    tasks: taskReducer,
    announcements: announcementReducer,
    staff: AdminStaffSlice,
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
    payroll: payrollReducer,
    shifts: shiftsReducer,
    staffProfile: staffProfileReducer,
    roomDetails: roomDetailsReducer,
    staffDashboard: staffDashboardReducer,
    performance: staffPerformanceReducer,
    leavestaff: leaveStaffReducer,
    stafftasks: staffTasksReducer
  },
})

export default store