// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBj72HHg8lH20FLESS-VEV_irJVLVEK9f0",
  authDomain: "weather-forecast-36a33.firebaseapp.com",
  projectId: "weather-forecast-36a33",
  storageBucket: "weather-forecast-36a33.appspot.com",
  messagingSenderId: "138869836082",
  appId: "1:138869836082:web:3c85df486f04bededc6f2b",
  measurementId: "G-B1WBTWC1CT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
