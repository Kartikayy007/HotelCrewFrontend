import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCheckIns, fetchCheckIns, selectCheckInsLoading } from '../../../redux/slices/CheckInSlice';
import { Dialog, DialogContent, DialogActions, Button, Skeleton } from '@mui/material';
import NewCustomerForm from './NewCustomerForm';
import {
  selectAllTasks,
  fetchTasks,
  selectTasksByStatus,
  selectTaskMetrics
} from '../../../redux/slices/TaskSlice';
import AnnouncementSection from './AnnouncementSection';
import { selectCustomers, fetchCustomers } from '../../../redux/slices/customerSlice';
import { PieChart } from '@mui/x-charts';
import { 
  selectStaffAttendance, 
  fetchStaffAttendance 
} from '../../../redux/slices/StaffAttendanceSlice.tsx';

interface RoomSelection {
  type: string;
  quantity: number;
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const checkInsFromRedux = useSelector(selectCheckIns);
  const allCustomers = useSelector(selectCustomers);
  const isLoading = useSelector(selectCheckInsLoading);
  const taskMetrics = useSelector(selectTaskMetrics);
  const attendanceData = useSelector(selectStaffAttendance);

  useEffect(() => {
    dispatch(fetchCheckIns());
    dispatch(fetchCustomers());
    dispatch(fetchTasks());
    dispatch(fetchStaffAttendance());
  }, [dispatch]);

  // Refresh customers when new check-in occurs
  useEffect(() => {
    if (checkInsFromRedux?.length > 0) {
      dispatch(fetchCustomers());
    }
  }, [checkInsFromRedux, dispatch]);

  // Get recent 20 customers sorted by check-in time
  const getRecentCustomers = () => {
    return [...allCustomers]
      .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time))
      .slice(0, 20)
      .map(customer => ({
        profile: customer.name,
        checkIn: new Date(customer.check_in_time).toLocaleDateString(),
        checkOut: new Date(customer.check_out_time).toLocaleDateString(),
        duration: Math.ceil(
          (new Date(customer.check_out_time) - new Date(customer.check_in_time)) /
          (1000 * 60 * 60 * 24)
        ),
        room: customer.room_no.toString(),
        status: customer.status
      }));
  };

  const calculateTaskStats = () => {
    const total = taskMetrics.total;
    if (total === 0) return [
      { name: 'Completed', value: 0 },
      { name: 'Remaining', value: 0 }
    ];

    const completed = taskMetrics.completed;
    const remaining = taskMetrics.pending; // This includes both pending and in_progress

    return [
      { name: 'Completed', value: Math.round((completed / total) * 100) },
      { name: 'Remaining', value: Math.round((remaining / total) * 100) }
    ];
  };

  const taskData = calculateTaskStats();

  const calculateAttendancePercentage = () => {
    if (!attendanceData) return { present: 0, absent: 0 };
    
    const totalDays = attendanceData.total_days_up_to_today;
    const daysPresent = attendanceData.days_present;
    const leaves = attendanceData.leaves;
    
    const presentPercentage = Math.round((daysPresent / totalDays) * 100);
    const absentPercentage = Math.round(((totalDays - daysPresent) / totalDays) * 100);
    
    return { present: presentPercentage, absent: absentPercentage };
  };

  const attendance = calculateAttendancePercentage();

  const COLORS = {
    task: ['#252941', '#E6EEF9'],
    attendance: ['#4338CA', '#E6EEF9']
  };

  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <tr key={item} className="border-b">
          <td className="p-3"><Skeleton variant="text" width={100} /></td>
          <td className="p-3"><Skeleton variant="text" width={80} /></td>
          <td className="p-3"><Skeleton variant="text" width={80} /></td>
          <td className="p-3"><Skeleton variant="text" width={60} /></td>
          <td className="p-3"><Skeleton variant="text" width={40} /></td>
          <td className="p-3"><Skeleton variant="rectangular" width={60} height={24} /></td>
        </tr>
      ))}
    </>
  );

  const EmptyState = () => (
    <tr>
      <td colSpan={6} className="text-center p-8">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg font-medium">No Customers Yet</p>
          <p className="text-sm">New customers will appear here when they check in</p>
        </div>
      </td>
    </tr>
  );

  const refreshCustomers = () => {
    dispatch(fetchCustomers());
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">Dashboard</h1>

      <div className="grid  grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto ">
              <table className="w-full">
                <thead className="bg-[#252941] text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-center rounded-tl-lg">PROFILE</th>
                    <th className="p-3 text-center">Check-in</th>
                    <th className="p-3 text-center">Check-out</th>
                    <th className="p-3 text-center">Duration</th>
                    <th className="p-3 text-center">Room</th>
                    <th className="p-3 text-center rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : allCustomers.length > 0 ? (
                    getRecentCustomers().map((customer, index) => (
                      <tr 
                        key={index} 
                        className="even:bg-[#F1F6FC] odd:bg-[#DEE8FF] hover:bg-gray-50 border-b"
                      >
                        <td className="p-3 text-center">{customer.profile}</td>
                        <td className="p-3 text-center">{customer.checkIn}</td>
                        <td className="p-3 text-center">{customer.checkOut}</td>
                        <td className="p-3 text-center">{customer.duration}</td>
                        <td className="p-3 text-center">{customer.room}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full ${
                            customer.status === 'VIP' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <NewCustomerForm onCheckInSuccess={refreshCustomers} />

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Task Progress</h2>
          <div className="flex justify-center items-center mt-20">
            <div className="relative w-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl -mt-8 font-bold">
                  {Math.round((taskMetrics.completed / (taskMetrics.total || 1)) * 100)}%
                </span>
              </div>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: taskMetrics.completed, color: '#34D399' },
                      { id: 1, value: taskMetrics.pending, color: '#facc15' }
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    innerRadius: 40,
                    outerRadius: 70,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                width={280}
                height={192}
                margin={{ bottom: 40 }}
              />
            </div>
            <div className="flex flex-col -mt-16 justify-center">
              <div>
                <h3 className="text-xl">Pending Tasks</h3>
                <p className="text-3xl font-bold text-blue-600">{taskMetrics.pending}</p>
              </div>
              <div>
                <h3 className="text-xl">Completed Tasks</h3>
                <p className="text-3xl font-bold text-[#34D399]">{taskMetrics.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <div className="flex justify-center items-center mt-20">
            <div className="relative w-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl -mt-8 font-bold">{attendance.present}%</span>
              </div>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: attendance.present, color: '#E6EEF9' },
                      { id: 1, value: attendance.absent, color: '#252941' }
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    innerRadius: 40,
                    outerRadius: 70,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                width={280}
                height={192}
                margin={{ bottom: 40 }}
              />
            </div>
            <div className="flex flex-col -mt-16 justify-center">
              <div className="text-center">
                <h3 className="text-xl">Present</h3>
                <p className="text-3xl font-bold text-[#4338CA]">{attendance.present}%</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl">Absent</h3>
                <p className="text-3xl font-bold text-[#252941]">{attendance.absent}%</p>
              </div>
            </div>
          </div>
        </div>

        <AnnouncementSection />
      </div>
    </section>
  );
};

export default Dashboard;