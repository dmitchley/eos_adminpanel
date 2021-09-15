// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDd895-k2fxPG1j6TTm012xox_hlhvjLO0",
  authDomain: "eos-danceshool.firebaseapp.com",
  projectId: "eos-danceshool",
  storageBucket: "eos-danceshool.appspot.com",
  messagingSenderId: "367598595350",
  appId: "1:367598595350:web:8ddfb8751d82d83df73437",
  measurementId: "G-HTSXCZC53H"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);


});

self.addEventListener('notificationclick', (event) => {
  console.log('----- notificationclick -----');
  console.log(event)
  console.log(window.location.href, payload.notification.click_action);
  if (event.action) {
    clients.openWindow(event.action, '_blank');
    // clients.openWindow('http://localhost:3000/admin/Uniformrequest')
  }
  event.notification.close();
});