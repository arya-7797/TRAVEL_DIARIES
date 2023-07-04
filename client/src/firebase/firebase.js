
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJ7xoTfHJCssvvfBHz_VEffjHuRarbboc",
  authDomain: "diary-80b3b.firebaseapp.com",
  databaseURL: "https://diary-80b3b-default-rtdb.firebaseio.com",
  projectId: "diary-80b3b",
  storageBucket: "diary-80b3b.appspot.com",
  messagingSenderId: "355861167143",
  appId: "1:355861167143:web:ebe0d346f3100adc8fe202",
  measurementId: "G-5Y14M2MHSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
