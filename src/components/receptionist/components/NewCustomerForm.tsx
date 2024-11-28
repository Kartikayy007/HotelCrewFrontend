import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Skeleton, Snackbar, Alert } from '@mui/material';
import { AppDispatch } from '../../../Store';
import { bookRoom } from '../../../redux/slices/CheckInSlice';
import { fetchHotelDetails, selectHotelDetails } from '../../../redux/slices/HotelDetailsSlice';
import LoadingAnimation from '../../common/LoadingAnimation';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  roomType: string;
  checkOutTime: string;
  customerStatus: CustomerStatus;
}

type CustomerStatus = 'VIP' | 'REGULAR';

interface FormErrors {
  email: string;
  phoneNumber: string;
}

interface TouchedFields {
  email: boolean;
  phoneNumber: boolean;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

interface BookingRequest {
  room_type: string;
  name: string;
  phone_number: string;
  email: string;
  check_out_time: string;
  status: string;
}

interface Props {
  onCheckInSuccess: () => void;
}

const NewCustomerForm: React.FC<Props> = ({ onCheckInSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const hotelDetails = useSelector(selectHotelDetails);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    roomType: '',
    checkOutTime: '',
    customerStatus: 'REGULAR'
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    phoneNumber: ''
  });

  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    phoneNumber: false
  });

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (fieldName: keyof TouchedFields): void => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData: BookingRequest = {
        room_type: formData.roomType,
        name: formData.name,
        phone_number: formData.phoneNumber,
        email: formData.email,
        check_out_time: formData.checkOutTime,
        status: formData.customerStatus
      };

      await dispatch(bookRoom(bookingData)).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Customer checked in successfully!',
        severity: 'success'
      });

      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        roomType: '',
        checkOutTime: '',
        customerStatus: 'REGULAR'
      });

      // Call the refresh callback after successful check-in
      onCheckInSuccess();
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchHotelDetails());
  }, [dispatch]);

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton variant="rectangular" height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" height={40} className="rounded-lg" />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <div>
                <Tooltip
                  open={touched.email && Boolean(errors.email)}
                  title={errors.email}
                  arrow
                  placement="top"
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: '#f44336',
                      color: 'white',
                      fontSize: '0.875rem',
                    }
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full p-2 border rounded-lg ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  />
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  open={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  title={errors.phoneNumber}
                  arrow
                  placement="top"
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: '#f44336',
                      color: 'white',
                      fontSize: '0.875rem',
                    }
                  }}
                >
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('phoneNumber')}
                    className={`w-full p-2 border rounded-lg ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                </Tooltip>
              </div>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Room Type</option>
                {hotelDetails?.room_types?.map((room, index) => (
                  <option key={index} value={room.room_type}>
                    {room.room_type} ({room.count} available)
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <select
                value={formData.customerStatus}
                onChange={(e) => setFormData({ ...formData, customerStatus: e.target.value as 'VIP' | 'REGULAR' })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="REGULAR">Regular Customer</option>
                <option value="VIP">VIP Customer</option>
              </select>
            </>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#3F4870] text-white p-2 font-semibold rounded hover:bg-[#252941] 
            flex items-center justify-center ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <LoadingAnimation size={24} color="#ffffff" />
            ) : (
              'Check In Customer'
            )}
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