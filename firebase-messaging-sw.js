
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGs4UO-AO0DpWsTpihdOddVSfFSaa5bQI",
    authDomain: "bus-tracking-system-a4f93.firebaseapp.com",
    projectId: "bus-tracking-system-a4f93",
    storageBucket: "bus-tracking-system-a4f93.appspot.com",
    messagingSenderId: "1024707448915",
    appId: "1:1024707448915:web:d936d9fa6d7e27081976a6",
    measurementId: "G-RN3MGWKE0H"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('bus-tracking-system/firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch((err) => {
        console.log('Service Worker registration failed:', err);
    });
}
