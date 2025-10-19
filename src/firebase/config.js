// // firebase.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// // Tumhara EXACT Firebase Config - YAHI USE KARO
// const firebaseConfig = {
//   apiKey: "AIzaSyDcjosGpgqImuWHQ29LLcBLIekCm4IMYhM",
//   authDomain: "videocallapp25.firebaseapp.com",
//   projectId: "videocallapp25",
//   storageBucket: "videocallapp25.firebasestorage.app",
//   messagingSenderId: "74266125655",
//   appId: "1:74266125655:web:1f4b5aba84772fdb200a12"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize services
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export default app;




// // firebase/config.js
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// // Tumhara Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyDcjosGpgqImuWHQ29LLcBLIekCm4IMYhM",
//   authDomain: "videocallapp25.firebaseapp.com",
//   projectId: "videocallapp25",
//   storageBucket: "videocallapp25.firebasestorage.app",
//   messagingSenderId: "74266125655",
//   appId: "1:74266125655:web:1f4b5aba84772fdb200a12"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize services
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export default app;








// import { Platform } from 'react-native';
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getDatabase } from 'firebase/database';
// // import { getDatabase } from 'firebase/database'; // Add this import
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   initializeAuth,
//   getReactNativePersistence,
//   browserSessionPersistence,
// } from 'firebase/auth';

// // ✅ Hardcoded Firebase config
// // const firebaseConfig = {
// //   apiKey: 'AIzaSyAAYIyQcCPHb7YB5dsQ85l-8YFjEn6YD2s',
// //   authDomain: 'hiddochatapp.firebaseapp.com',
// //   projectId: 'hiddochatapp',
// //   storageBucket: 'hiddochatapp.appspot.com',
// //   messagingSenderId: '879938427958',
// //   appId: '1:879938427958:android:c8cacc8a6553297ef7cc97',
// // };


// const firebaseConfig = {
//   apiKey: 'AIzaSyAO05nIto1UkqE4Yp61imFTrizspcXN1GA',
//   authDomain: 'hiddo-3887f.firebaseapp.com',
//   projectId: 'hiddo-3887f',
//   storageBucket: 'hiddo-3887f.firebasestorage.app',
//   messagingSenderId: '775242278433',
//   appId: '1:775242278433:android:b76d914244d5d8fd37a560',
// };


// // ✅ Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const persistence =
//   Platform.OS === 'web'
//     ? browserSessionPersistence
//     : getReactNativePersistence(ReactNativeAsyncStorage);

// export const auth = initializeAuth(app, { persistence });
// export const database = getFirestore();
// export const db = getFirestore(app);





// ✅ Import Firebase SDKs for web
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';

// ✅ Your Firebase config (Web version)
const firebaseConfig = {
  apiKey: 'AIzaSyAO05nIto1UkqE4Yp61imFTrizspcXN1GA',
  authDomain: 'hiddo-3887f.firebaseapp.com',
  projectId: 'hiddo-3887f',
  storageBucket: 'hiddo-3887f.appspot.com', // 👈 fixed: should end with .appspot.com
  messagingSenderId: '775242278433',
  appId: '1:775242278433:web:b76d914244d5d8fd37a560', // 👈 changed android → web
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth (browser)
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence); // keep session in browser

// ✅ Initialize Firestore & Realtime Database
const db = getFirestore(app);
const realtimeDB = getDatabase(app);

// ✅ Export everything
export { app, auth, db, realtimeDB };



