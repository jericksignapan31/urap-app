// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Initialize Analytics (for web only)
try {
  const analytics = getAnalytics(app);
} catch (error) {
  // Analytics may not be available in all environments
  console.log("Analytics not available");
}

export default app;