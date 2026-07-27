// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);