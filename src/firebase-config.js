import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyAeNBaiZMi00tOI4fKLNZw5EOeW2ONtrEg",
    authDomain: "hotelcrewfrontend.firebaseapp.com",
    projectId: "hotelcrewfrontend",
    storageBucket: "hotelcrewfrontend.firebasestorage.app",
    messagingSenderId: "97278318826",
    appId: "1:97278318826:web:a03063b15ae03e1c345f93",
    measurementId: "G-FVBMZQ5MH0"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestPermissionAndGetToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            return await getToken(messaging, {
                vapidKey: "BPLfqgHCgUX_ArfuCUFfAb3qzMf2zSOxGofeULnG6KUi-MH5QCFLjKz4qHj5ttJLAdXC-qg0bUyliE5qYQjSdas"
            });
        }
        throw new Error('Notification permission denied');
    } catch (error) {
        console.error('Error getting token:', error);
        throw error;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log('Received foreground message:', payload);
            resolve(payload);
        });
    });