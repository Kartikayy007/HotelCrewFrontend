import React, { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';

interface RoomSelection {
  type: string;
  quantity: number;
}

const Dashboard = () => {
  const taskData = [
    { name: 'Completed', value: 79 },
    { name: 'Remaining', value: 21 }
  ];

  const attendanceData = [
    { name: 'Present', value: 86 },
    { name: 'Absent', value: 14 }
  ];

  const recentCustomers = [
    { profile: 'Arjun Gupta', checkIn: '29/11/24', checkOut: '-----', duration: '-----', room: '406', status: 'VIP' },
    { profile: 'Shreya Rai', checkIn: '26/11/24', checkOut: '-----', duration: '-----', room: '203', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '30/11/24', duration: '5', room: '306', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '28/11/24', duration: '3', room: '102', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '30/11/24', duration: '5', room: '306', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '28/11/24', duration: '3', room: '102', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '30/11/24', duration: '5', room: '306', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '28/11/24', duration: '3', room: '102', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '30/11/24', duration: '5', room: '306', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '30/11/24', duration: '5', room: '306', status: 'Regular' },
    { profile: 'Shreya Rai', checkIn: '25/11/24', checkOut: '28/11/24', duration: '3', room: '102', status: 'Regular' }
  ];

  const COLORS = {
    task: ['#252941', '#E6EEF9'],
    attendance: ['#4338CA', '#E6EEF9']
  };

  return (
    <section className="bg-[#E6EEF9] min-h-screen w-full p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">Dashboard</h1>
      
      <div className="grid  grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
          <div className="overflow-x-auto">
            <div className="max-h-80 overflow-y-auto">
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

        <div className="bg-white rounded-lg p-6">
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
            <p>On-going tasks: 23</p>
            <p>Completed tasks: 40</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
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

        <div className="bg-white rounded-lg p-6">
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

const NewCustomerForm = () => {
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [roomSelections, setRoomSelections] = useState<RoomSelection[]>([]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  
  const roomTypes = ["Single Room", "Double Room", "Suite"];

  const addRoomSelection = (type: string, quantity: number) => {
    setRoomSelections([...roomSelections, { type, quantity }]);
    setOpenRoomDialog(false);
    setShowAddRoom(false);
  };

  const removeRoomSelection = (index: number) => {
    setRoomSelections(roomSelections.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">New Customer</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 rounded border"
        />
        <input
          type="email"
          placeholder="E-mail"
          className="w-full p-2 rounded border"
        />
        <input
          type="tel"
          placeholder="Contact Number"
          className="w-full p-2 rounded border"
        />

        <div className="border rounded p-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {roomSelections.length ? 
                `${roomSelections.length} room(s) selected` : 
                'No rooms selected'}
            </span>
            <button
              type="button"
              onClick={() => setOpenRoomDialog(true)}
              className="text-[#5663AC] text-sm hover:underline"
            >
              {roomSelections.length ? 'Edit Rooms' : 'Add Rooms'}
            </button>
          </div>
        </div>

        <select className="w-full p-2 rounded border">
          <option value="">Status</option>
          <option value="regular">Regular</option>
          <option value="vip">VIP</option>
        </select>

        <button 
          type="submit"
          className="w-full p-2 bg-[#5663AC] text-white rounded hover:bg-[#4A5899]"
        >
          Add Customer
        </button>
      </form>

      <Dialog 
        open={openRoomDialog} 
        onClose={() => setOpenRoomDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <h3 className="font-semibold mb-4">Add Rooms</h3>
          <div className="space-y-4">
            <div className="max-h-[200px] overflow-y-auto">
              {roomSelections.map((room, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded mb-2">
                  <span>{room.quantity}x {room.type}</span>
                  <button
                    type="button"
                    onClick={() => removeRoomSelection(index)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select 
                className="p-2 rounded border"
                id="roomType"
              >
                <option value="">Select Room Type</option>
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Quantity"
                className="p-2 rounded border"
                id="quantity"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenRoomDialog(false)}
            variant="outlined"
            sx={{ borderColor: '#252941', color: '#252941' }}
          >
            Done
          </Button>
          <Button
            onClick={() => {
              const typeEl = document.getElementById('roomType') as HTMLSelectElement;
              const quantityEl = document.getElementById('quantity') as HTMLInputElement;
              if (typeEl.value && quantityEl.value) {
                addRoomSelection(typeEl.value, parseInt(quantityEl.value));
              }
            }}
            variant="contained"
            sx={{ bgcolor: '#252941', '&:hover': { bgcolor: '#1A1F35' } }}
          >
            Add Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;