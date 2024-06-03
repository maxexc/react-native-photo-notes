import AsyncStorage from "@react-native-async-storage/async-storage";

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";


const firebaseConfig = {
    apiKey: "AIzaSyDvxyONTJAp5OvD-SaDSrHe1g_554QZB0k",
    authDomain: "react-native-photo-notes.firebaseapp.com",
    projectId: "react-native-photo-notes",
    storageBucket: "react-native-photo-notes.appspot.com",
    messagingSenderId: "29353358968",
    appId: "1:29353358968:web:f47d374f95fd444a66df8d",
    measurementId: "G-JN599YHQQL",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
