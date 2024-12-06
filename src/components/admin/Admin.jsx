import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './components/AdminSidebar';
import { setActiveComponent } from '../../redux/slices/AdminSlice';
import { messaging } from '../../config/firebase-init';
import { getToken, onMessage } from '@firebase/messaging';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { RevealBento } from '../common/IncompleteRegisteration';

const Admin = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector(state => state.admin);
  const { token } = useSelector(state => state.user);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  
  // Initial state setup with debug logging
  const [showOverlay, setShowOverlay] = useState(() => {
    const isHotelRegistered = localStorage.getItem('isHotelRegistered');
    const shouldShowOverlay = isHotelRegistered === 'false' || !isHotelRegistered;
    
     ('Initial State Setup:', {
      isHotelRegistered,
      fromLocalStorage: isHotelRegistered === null ? 'null' : isHotelRegistered,
      shouldShowOverlay,
      typeof: typeof isHotelRegistered
    });
    
    return shouldShowOverlay;
  });

  const registerDeviceToken = async (fcmToken) => {
    try {
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/auth/register-device-token/',
        { fcm_token: fcmToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
       (fcmToken)
       ('Device token registered:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error registering device token:', error);
      throw error;
    }
  };

  async function initializeNotifications() {
    try {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      if (Notification.permission !== 'granted') {
        throw new Error('Notification permission not granted.');
      }

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
         ('ServiceWorker registered:', registration);
      }

      const fcmToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
      if (!fcmToken) {
        throw new Error('Failed to get FCM token.');
      }

      if (!token) {
        throw new Error('Access token not available.');
      }

      await registerDeviceToken(fcmToken);
      onMessage(messaging, (payload) => {
         ('Received foreground message:', payload);
        setSnackbarMessage(payload.notification?.body || 'New Notification');
        setSnackbarOpen(true);
        showNotification(payload.notification?.body || 'New Notification', 'info');
      });

      setNotificationStatus('enabled');
    } catch (error) {
      console.error('Notification initialization failed:', error);
      setNotificationStatus('failed');
      showNotification('Failed to enable notifications', 'error');
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const showNotification = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  useEffect(() => {
    initializeNotifications();
    
    const isHotelRegistered = localStorage.getItem('isHotelRegistered');
    const shouldShowOverlay = isHotelRegistered === 'false' || !isHotelRegistered;
    
     ('UseEffect Overlay Check:', {
      isHotelRegistered,
      fromLocalStorage: isHotelRegistered === null ? 'null' : isHotelRegistered,
      shouldShowOverlay,
      typeof: typeof isHotelRegistered,
      comparison: {
        isExactlyFalse: isHotelRegistered === 'false',
        isNull: isHotelRegistered === null,
        isFalsy: !isHotelRegistered
      }
    });
    
    setShowOverlay(shouldShowOverlay);
  }, []); 

  const handleMenuItemClick = (component) => {
    dispatch(setActiveComponent(component));
  };

  return (
    <>
      { ('Render - showOverlay:', showOverlay)}
      {showOverlay ? (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <RevealBento />
        </div>
      ) : (
        <div className="flex h-screen">
          <AdminSidebar onMenuItemClick={handleMenuItemClick} />
          <div className='h-screen w-screen'>
          <div className='flex h-screen w-screen'>
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
      )}
    </>
  );
};

export default Admin;