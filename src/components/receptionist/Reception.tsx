import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import { setActiveComponent } from '../../redux/slices/ReceptionSlice';
import { messaging } from '../../config/firebase-init';
import { getToken, onMessage } from '@firebase/messaging';
import store from '../../redux/Store';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

type RootState = ReturnType<typeof store.getState>;

const Reception: React.FC = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector((state: RootState) => state.reception);
  const [notificationStatus, setNotificationStatus] = useState<string>('');
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
      // console.log('Device token registereddd:', response.data);
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

      const fcmToken = await getToken(messaging, { vapidKey: 'BOqhVdEkOMB9fFPor6H_d1a8DPgeIh-yTgwcD8NL12Jpm2XfIW9Os6e_QLxvn35vDBL5XwaFeAbLPyEVHgibqNE' });
      if (!fcmToken) {
        throw new Error('Failed to get FCM token.');
      }
      console.log('FCM Token:', fcmToken);

      const accessToken = localStorage.getItem('accessToken'); 
      if (!accessToken) {
        throw new Error('Access token not available.');
      }

      const result = await registerDeviceToken(fcmToken, accessToken);
      onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        setSnackbarMessage(payload.notification?.body || 'New Notification');
        setSnackbarOpen(true);
        toast.info(payload.notification?.body, {
          title: payload.notification?.title,
          position: 'top-right',
          autoClose: 5000,
        });
      });

      setNotificationStatus('enabled');
      toast.success('Notifications enabled successfully!');
    } catch (error) {
      console.error('Notification initialization failed:', error);
      setNotificationStatus('failed');
      toast.error('Failed to enable notifications. Please check browser settings.');
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const showNotification = (msg: string, sev: 'success' | 'error' | 'info' | 'warning') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  useEffect(() => {
    initializeNotifications();
  }, []);

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