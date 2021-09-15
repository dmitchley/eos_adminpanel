import firebase from "firebase";
import 'firebase/messaging';
import createBrowserHistory from 'history/createBrowserHistory';
// import navigationService from './navigationService';

import { onHandleNotification } from 'reduxStore/ReduxAction/notificationAction';
import configureStore from 'reduxStore/configureStore';
// import "firebase/auth";
// import "firebase/firestore";

// const store = configureStore();

const firebaseConfig = {
    // apiKey: "AIzaSyDd895-k2fxPG1j6TTm012xox_hlhvjLO0",
    // authDomain: "eos-danceshool.firebaseapp.com",
    // projectId: "eos-danceshool",
    // storageBucket: "eos-danceshool.appspot.com",
    // messagingSenderId: "367598595350",
    // appId: "1:367598595350:web:8ddfb8751d82d83df73437",
    // measurementId: "G-HTSXCZC53H"

    // apiKey: "AIzaSyAZagGsdO8z7T4dozuh9eDkBBjcf6pO1qo",
    // authDomain: "eos-danceschool2.firebaseapp.com",
    // projectId: "eos-danceschool2",
    // storageBucket: "eos-danceschool2.appspot.com",
    // messagingSenderId: "599512260640",
    // appId: "1:599512260640:web:f551e5c89ef4f768e89c45"

    apiKey: "AIzaSyB16CYXhhuUTVzkVmJ2sxMGA0lZPlMs2is",
    authDomain: "eos-dance-studio.firebaseapp.com",
    projectId: "eos-dance-studio",
    storageBucket: "eos-dance-studio.appspot.com",
    messagingSenderId: "728955543954",
    appId: "1:728955543954:web:63a44a1749e64483ef614b"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = firebase.firestore();
export const messaging = firebase.messaging();
export const db = baseDb;
export const serverKey = 'AAAAqbki4ZI:APA91bGa3UFzS8b9ZgkXryD1SHrooC9Nqo39HcwCxCwCM34TxY001UqO9aUzBJZqw8SHfMrpiojaR9oKl4LNLj9ow-z36sQN6RbYN4sIhGD5mmwQhD4q_tWYOBT1mJw0JQ_Sv3cBahUQ'

export const askForPermissionToReceiveNotifications = async () => {
    try {
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('user token: ', token);

        return token;
    } catch (error) {
        console.error(error);
    }
}

// const onNotification = (focusRoute) => {
//     console.log('---- onNotification -----')
//     console.log(focusRoute)
//     // createBrowserHistory().push(focusRoute)

//     // store.onHandleNotification(focusRoute);
// }

// messaging.onMessage(function (payload) {
//     try {
//         console.log('Message received. ', payload);

//         const { data } = payload;
//         const noteTitle = payload.notification.title;
//         const noteOptions = {
//             body: payload.notification.body,
//             icon: "typewriter.jpg", //this is my image in my public folder
//         };

//         console.log("title ", noteTitle, " ", payload.notification.body);
//         //var notification = //examples include this, seems not needed

//         var notification = new Notification(noteTitle, noteOptions);
//         notification.onclick = (event) => {
//             event.preventDefault(); // prevent the browser from focusing the Notification's tab
//             // console.log(window.location.href, payload.notification.click_action);
//             // console.clear();
//             console.log('Message received. ', payload);
//             console.log(data.focusRoute)
//             // console.log(window.location)
//             // console.log(payload.notification)
//             // console.log(window.location.origin + '/admin/Uniformrequest')
//             // await onHandleNotification(data.focusRoute);
//             onNotification(data.focusRoute);
//             // createBrowserHistory().push('/admin/addParent');
//             // if (window.location.href !== payload.notification.click_action) {
//             //     // window.location.href = window.location.origin + '/admin/Uniformrequest';
//             //     window.location.href = payload.notification.click_action;
//             // }
//             notification.close();
//         }
//         //   new Notification(noteTitle, noteOptions).onclick = function (event) {
//         //     // console.log(event);
//         //     // console.log(payload.notification.click_action);
//         //     if(payload && payload.notification &&  payload.notification.click_action &&  payload.notification.click_action.length > 0)
//         //     {
//         //       window.open(payload.notification.click_action, '_blank');
//         //     }

//         //     this.close();
//         //   };
//     }
//     catch (err) {
//         console.log('Caught error: ', err);
//     }
// });

// messaging.onMessage((payload) => {
//     console.log('foreground Message received. ', payload);
// });

// register service worker & handle push events
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', async () => {
//         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
//             updateViaCache: 'none'
//         });
//         // messaging.useServiceWorker(registration);
//         messaging.onMessage((payload) => {
//             const title = payload.notification.title;
//             const options = {
//                 body: payload.notification.body,
//                 icon: payload.notification.icon,
//                 actions: [
//                     {
//                         action: payload.fcmOptions.link,
//                         title: 'Book Appointment'
//                     }
//                 ]
//             };
//             registration.showNotification(title, options);
//         });
//     });
// }

// if ('serviceWorker' in navigator) {
//     const registration = runtime.register();

//     registerEvents(registration, {
//         onInstalled: () => {
//             registration.showNotification('Title', { body: 'Body.' });
//         }
//     })
// } else {
//     console.log('serviceWorker not available')
// }

// messaging.onMessage((payload) => {
//     console.log("Message received. ", payload);
//     //foreground notifications

//     if ('serviceWorker' in navigator) {

//         navigator.serviceWorker
//             .register('./service-worker.js', { scope: './' })
//             .then(function (registration) {
//                 console.log("Service Worker Registered");
//                 setTimeout(() => {
//                     registration.showNotification(payload.data.title, {
//                         body: payload.data.body,
//                         data: payload.data.link
//                     });
//                     registration.update();
//                 }, 100);
//             })
//             .catch(function (err) {
//                 console.log("Service Worker Failed to Register", err);
//             })

//     }
// });

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         messaging.onMessage((payload) => {
//             resolve(payload);
//         });
//     });