importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
const firebaseConfig = {
    apiKey: "AIzaSyCGs4UO-AO0DpWsTpihdOddVSfFSaa5bQI",
    authDomain: "bus-tracking-system-a4f93.firebaseapp.com",
    projectId: "bus-tracking-system-a4f93",
    storageBucket: "bus-tracking-system-a4f93.appspot.com",
    messagingSenderId: "1024707448915",
    appId: "1:1024707448915:web:d936d9fa6d7e27081976a6",
    measurementId: "G-RN3MGWKE0H"
  };

  const app = initializeApp(firebaseConfig);

  const messaging = getMessaging(app);

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
