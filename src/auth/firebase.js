// src/firebase.js

// Import required Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// (Optional) Analytics – only works in browser
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "moviewebapp-28a1f.firebaseapp.com",
  projectId: "moviewebapp-28a1f",
  storageBucket: "moviewebapp-28a1f.firebasestorage.app",
  messagingSenderId: "984783488427",
  appId: "1:984783488427:web:7df109ec3954c187e0feee",
  measurementId: "G-2D99QBK1GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Analytics is optional (use only in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };
