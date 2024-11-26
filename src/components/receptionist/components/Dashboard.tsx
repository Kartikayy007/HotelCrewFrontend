import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCheckIns, fetchCheckIns } from '../../../redux/slices/CheckInSlice';
import { PieChart, Pie, Cell } from 'recharts';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import NewCustomerForm from './NewCustomerForm'; 
import { 
  selectAllTasks, 
  fetchTasks, 
  selectTasksByStatus 
} from '../../../redux/slices/TaskSlice';

interface RoomSelection {
  type: string;
  quantity: number;
}

const Dashboard = () => {
  // Dummy check-in data
  const checkIns = [
    {
      name: "John Doe",
      check_in_time: "2024-03-20T10:00:00",
      check_out_time: "2024-03-22T12:00:00",
      room_number: "101",
      status: "VIP"
    },
    {
      name: "Jane Smith",
      check_in_time: "2024-03-19T14:00:00",
      check_out_time: "2024-03-21T11:00:00",
      room_number: "102",
      status: "REGULAR"
    }
  ];

  // Dummy task data
  const allTasks = [
    { id: 1, status: 'completed' },
    { id: 2, status: 'pending' },
    { id: 3, status: 'in_progress' },
    { id: 4, status: 'completed' }
  ];

  const completedTasks = allTasks.filter(task => task.status === 'completed');
  const pendingTasks = allTasks.filter(task => task.status === 'pending');
  const inProgressTasks = allTasks.filter(task => task.status === 'in_progress');

  const recentCustomers = checkIns
    .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime())
    .slice(0, 50)
    .map(checkIn => ({
      profile: checkIn.name,
      checkIn: new Date(checkIn.check_in_time).toLocaleDateString(),
      checkOut: checkIn.check_out_time ? new Date(checkIn.check_out_time).toLocaleDateString() : '-----',
      duration: checkIn.check_out_time ? 
        Math.ceil((new Date(checkIn.check_out_time) - new Date(checkIn.check_in_time)) / (1000 * 60 * 60 * 24)) : 
        '-----',
      room: checkIn.room_number || '---',
      status: checkIn.status
    }));

  // Calculate task statistics
  const calculateTaskStats = () => {
    const total = allTasks.length;
    if (total === 0) return [
      { name: 'Completed', value: 0 },
      { name: 'Remaining', value: 0 }
    ];

    const completed = completedTasks.length;
    const remaining = total - completed;

    return [
      { name: 'Completed', value: Math.round((completed / total) * 100) },
      { name: 'Remaining', value: Math.round((remaining / total) * 100) }
    ];
  };

  const taskData = calculateTaskStats();

  const attendanceData = [
    { name: 'Present', value: 86 },
    { name: 'Absent', value: 14 }
  ];

  const COLORS = {
    task: ['#252941', '#E6EEF9'],
    attendance: ['#4338CA', '#E6EEF9']
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">Dashboard</h1>
      
      <div className="grid  grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
          <div className="overflow-x-auto">
            <div className="max-h-80 overflow-y-auto ">
              <table className="w-full">
                <thead className="bg-[#252941] text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left rounded-tl-lg">PROFILE</th>
                    <th className="p-3 text-left">Check-in</th>
                    <th className="p-3 text-left">Check-out</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">Room</th>
                    <th className="p-3 text-left rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCustomers.map((customer, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{customer.profile}</td>
                      <td className="p-3">{customer.checkIn}</td>
                      <td className="p-3">{customer.checkOut}</td>
                      <td className="p-3">{customer.duration}</td>
                      <td className="p-3">{customer.room}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${
                          customer.status === 'VIP' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <NewCustomerForm />

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Task Progress</h2>
          <div className="flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={taskData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.task[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="mt-4 text-center">
            <p>On-going tasks: {inProgressTasks.length}</p>
            <p>Completed tasks: {completedTasks.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <div className="flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={attendanceData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.attendance[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="mt-4 text-center">
            <p>Attendance: 120/300</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Announcement Channel</h2>
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium">Important Announcement from Admin to All Staff</h3>
            <p className="mt-2">We would like to inform you about some key updates and important happening at the XYZ Hotel.</p>
            <p>The first important change is the......</p>
            <p className="mt-4 text-sm text-gray-500">15 November 2024 03:13 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;