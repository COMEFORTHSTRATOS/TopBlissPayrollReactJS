import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD2Bg7bFCyAzYIoia58-OLiu9Gg7mhq9K4",
  authDomain: "topblissreactjs.firebaseapp.com",
  projectId: "topblissreactjs",
  storageBucket: "topblissreactjs.firebasestorage.app",
  messagingSenderId: "609441590377",
  appId: "1:609441590377:web:d16ee678cd2afd352e06f8",
  measurementId: "G-59F7985707"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
