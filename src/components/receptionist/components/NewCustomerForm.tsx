import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Skeleton, Snackbar, Alert } from '@mui/material';
import { Tooltip as MuiTooltip } from '@mui/material';
import { format } from 'date-fns';
import { AppDispatch } from '../../../Store';
import { bookRoom } from '../../../redux/slices/CheckInSlice';
import { fetchHotelDetails, selectHotelDetails } from '../../../redux/slices/HotelDetailsSlice';
import LoadingAnimation from '../../common/LoadingAnimation';
import { 
  fetchRoomDetails, 
  selectRoomDetails, 
  selectRoomDetailsLoading 
} from '../../../redux/slices/RoomDetailsSlice';

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
  name: string;
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

const validateName = (name: string): string => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 'Name is required and cannot be empty';
  }
  return '';
};

const validatePhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phone) {
    return '';
  }
  if (digitsOnly.length !== 10) {
    return 'Phone number must be exactly 10 digits';
  }
  return '';
};

const validateForm = (data: FormData): boolean => {
  const phoneError = validatePhoneNumber(data.phoneNumber);
  const nameError = validateName(data.name);
  return Boolean(
    data.name.trim() && 
    data.email && 
    data.phoneNumber && 
    data.roomType && 
    data.checkOutTime && 
    !phoneError &&
    !nameError
  );
};

const NewCustomerForm: React.FC<Props> = ({ onCheckInSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const hotelDetails = useSelector(selectHotelDetails);
  const roomDetails = useSelector(selectRoomDetails);
  const roomsLoading = useSelector(selectRoomDetailsLoading);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    roomType: '',
    checkOutTime: '',
    customerStatus: 'REGULAR'
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showTooltips, setShowTooltips] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      const nameError = validateName(value);
      setErrors(prev => ({ ...prev, name: nameError }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'phoneNumber') {
      const phoneError = validatePhoneNumber(value);
      setErrors(prev => ({ ...prev, phoneNumber: phoneError }));
    }
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
    if (!validateForm(formData)) {
      setShowTooltips(true);
      return;
    }
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

      onCheckInSuccess();
      
    } catch (error: any) {
      const backendError = error.response?.data;
      const errorMessage = backendError?.status === 'error' 
        ? backendError.message
        : 'Booking failed';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchHotelDetails());
    dispatch(fetchRoomDetails());
  }, [dispatch]);

  useEffect(() => {
    if (showTooltips) {
      const timer = setTimeout(() => {
        setShowTooltips(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltips]);

  useEffect(() => {
    const handleClick = () => {
      setShowTooltips(false);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {roomsLoading ? (
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
              <MuiTooltip
                open={showTooltips && !formData.name}
                title="Name is required"
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
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </MuiTooltip>
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
                    placeholder="Phone Number (10 digits)"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, phoneNumber: value }));
                      const phoneError = validatePhoneNumber(value);
                      setErrors(prev => ({ ...prev, phoneNumber: phoneError }));
                    }}
                    onBlur={() => handleBlur('phoneNumber')}
                    className={`w-full p-2 border rounded-lg ${
                      touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''
                    }`}
                    maxLength={10}
                    pattern="[0-9]*"
                  />
                </Tooltip>
              </div>
              <MuiTooltip
                open={showTooltips && !formData.roomType}
                title="Room type is required"
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
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Room Type</option>
                  {roomDetails.map((room) => (
                    <option key={room.room_type} value={room.room_type}>
                      {room.room_type} - ₹{room.price}/night ({room.count} available)
                    </option>
                  ))}
                </select>
              </MuiTooltip>
              <MuiTooltip
                open={showTooltips && !formData.checkOutTime}
                title="Check-out time is required"
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
                  type="datetime-local"
                  value={formData.checkOutTime}
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </MuiTooltip>
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
            disabled={isSubmitting || roomsLoading || !validateForm(formData)}
            className={`w-full bg-[#3F4870] text-white p-2 font-semibold rounded-xl shadow-lg hover:bg-[#252941] 
            flex items-center justify-center ${(isSubmitting || roomsLoading || !validateForm(formData)) ? 'opacity-75' : ''}`}
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
