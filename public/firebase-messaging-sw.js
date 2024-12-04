importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAeNBaiZMi00tOI4fKLNZw5EOeW2ONtrEg",
    authDomain: "hotelcrewfrontend.firebaseapp.com",
    projectId: "hotelcrewfrontend",
    storageBucket: "hotelcrewfrontend.firebasestorage.app",
    messagingSenderId: "97278318826",
    appId: "1:97278318826:web:a03063b15ae03e1c345f93",
    measurementId: "G-FVBMZQ5MH0"
});

const messaging = firebase.messaging();

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

messaging.onBackgroundMessage((payload) => {
     ('Received background message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/notification-icon.png', // Add a default icon
        badge: '/notification-badge.png',
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
