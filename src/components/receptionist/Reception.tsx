import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import { setActiveComponent } from '../../redux/slices/ReceptionSlice';
// import { messaging } from '../../config/firebase-init';
// import { getToken, onMessage } from '@firebase/messaging';
import store from '../../redux/Store';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

type RootState = ReturnType<typeof store.getState>;

const Reception: React.FC = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector((state: RootState) => state.reception);
  // const [notificationStatus, setNotificationStatus] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleMenuItemClick = (component: React.ComponentType) => {
    dispatch(setActiveComponent(component));
  };

  const registerDeviceToken = async (fcmToken: string, accessToken: string) => {
    try {
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/auth/register-device-token/',
        { fcm_token: fcmToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering device token:', error);
      throw error;
    }
  };

 

  const handleClose = () => {
    setOpen(false);
  };




  return (
    <div className="flex h-screen">
      <Sidebar onMenuItemClick={handleMenuItemClick} />
      <div className="flex-1">
        {activeComponent && React.createElement(activeComponent)}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={severity} onClose={handleClose}>
          <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Reception;