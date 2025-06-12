
import { initializeApp , getApp, getApps} from "firebase/app";
import { getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "prepxdev-71379.firebaseapp.com",
  projectId: "prepxdev-71379",
  storageBucket: "prepxdev-71379.firebasestorage.app",
  messagingSenderId: "631444303304",
  appId: "1:631444303304:web:045a22b1576060bf7d64fd",
  measurementId: "G-M3PQJYQ91Z"
};

// Initialize Firebase
const app =   !getApps.length ? initializeApp(firebaseConfig) :getApp();
export const auth = getAuth(app);
export const db = getFirestore(app)