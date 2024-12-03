import axios from 'axios';
import { requestPermissionAndGetToken, onMessageListener } from '../config/firebase-init';

const API_URL = 'https://hotelcrew-1.onrender.com/api/auth/register-device-token/';

export const registerDeviceToken = async () => {
  try {
    const fcmToken = await requestPermissionAndGetToken();
    console.log(fcmToken);
    if (!fcmToken) throw new Error('Failed to get FCM token');

    const authToken = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      API_URL,
      { fcm_token: fcmToken },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Device token registered:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error registering device:');
    throw error;
  }
};

export const setupMessageListener = (callback) => {
  return onMessageListener().then(payload => {
    callback(payload);
  });
};