// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// @ts-expect-error - getReactNativePersistence exists at runtime (Metro resolves the
// package's "react-native" condition) but firebase's exports map orders "types" before
// "react-native", so TypeScript always resolves the non-RN typings for this subpath.
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2XfRccFkpdOitMJttkL9tmSG1AFIyBUw",
  authDomain: "urap-cf31d.firebaseapp.com",
  projectId: "urap-cf31d",
  storageBucket: "urap-cf31d.firebasestorage.app",
  messagingSenderId: "1022342855568",
  appId: "1:1022342855568:web:9d8d97bb396f199ed3d115",
  measurementId: "G-E8FZBJC96G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

export default app;
