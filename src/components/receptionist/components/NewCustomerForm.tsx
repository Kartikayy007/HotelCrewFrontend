import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { bookRoom } from '../../../redux/slices/CheckInSlice'; // Adjust the import path as needed
import { toast } from 'react-toastify'; 

interface RoomSelection {
  type: string;
  quantity: number;
}

// Update interfaces
interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  roomType: string;
  checkOutTime: string;
  customerStatus: 'VIP' | 'REGULAR'; 
}

interface BookingRequest {
  room_type: string;
  name: string;
  phone_number: string;
  email: string;
  check_out_time: string;
  status: string;
}

const NewCustomerForm = () => {
  const dispatch = useDispatch();
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    roomType: '',
    checkOutTime: '',
    customerStatus: 'REGULAR'
  });

  const roomTypes = ["Single Room", "Double Room", "Suite"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.roomType || !formData.checkOutTime) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    // Format the date without timezone information
    const checkOutDate = new Date(formData.checkOutTime);
    const formattedDate = checkOutDate.toISOString().split('.')[0]; // Remove milliseconds and timezone

    // Prepare booking data
    const bookingData: BookingRequest = {
      room_type: formData.roomType,
      name: formData.name,
      phone_number: formData.phoneNumber,
      email: formData.email,
      check_out_time: formattedDate,
      status: formData.customerStatus
    };

    try {
      const result = await dispatch(bookRoom(bookingData)).unwrap();
      setSnackbar({
        open: true,
        message: 'Customer checked in successfully!',
        severity: 'success'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        roomType: '',
        checkOutTime: '',
        customerStatus: 'REGULAR'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Booking failed: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <select
            value={formData.roomType}
            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Room Type</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Standard">Standard</option>
          </select>
          <input
            type="datetime-local"
            value={formData.checkOutTime}
            onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <select
            value={formData.customerStatus}
            onChange={(e) => setFormData({ ...formData, customerStatus: e.target.value as 'VIP' | 'REGULAR' })}
            className="w-full p-2 border rounded"
          >
            <option value="REGULAR">Regular Customer</option>
            <option value="VIP">VIP Customer</option>
          </select>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Check In Customer
          </button>
        </form>
      </div>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewCustomerForm;