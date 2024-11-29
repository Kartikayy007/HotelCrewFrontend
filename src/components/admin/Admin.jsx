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
  const [notificationStatus, setNotificationStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [showOverlay, setShowOverlay] = useState(false);

  const registerDeviceToken = async (fcmToken, accessToken) => {
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
      console.log('Device token registered:', response.data);
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
        console.log('ServiceWorker registered:', registration);
      }

      const fcmToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
      if (!fcmToken) {
        throw new Error('Failed to get FCM token.');
      }

      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        throw new Error('Access token not available.');
      }

      await registerDeviceToken(fcmToken, accessToken);
      onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
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
    const multiStepCompleted = localStorage.getItem('multiStepCompleted');
    if (multiStepCompleted === 'true') {
      setShowOverlay(true);
    }
  }, []);

  const handleMenuItemClick = (component) => {
    dispatch(setActiveComponent(component));
  };

  return (
    <>
      {showOverlay && <RevealBento />}
      <div className="flex h-screen">
        <AdminSidebar onMenuItemClick={handleMenuItemClick} />
        <div className='flex-1'>
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
    </>
  );
};

export default Admin;