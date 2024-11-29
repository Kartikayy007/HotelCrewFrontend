importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body
  });
});
