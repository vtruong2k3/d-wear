// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv7fi1V6pjRR3ylukPP5EVy_EnnQZvzxU",
  authDomain: "d-wear-a8cea.firebaseapp.com",
  projectId: "d-wear-a8cea",
  storageBucket: "d-wear-a8cea.firebasestorage.app",
  messagingSenderId: "430779882044",
  appId: "1:430779882044:web:eb5ffa9ba7bfab3a130139",
  measurementId: "G-8BS4NQRM9R",
};

// ✅ Export ra để file khác dùng được
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
