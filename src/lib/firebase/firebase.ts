// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAdminApp } from '@/lib/firebase/firebase-admin';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyD1j3Q6kcwILHGFw2MI8L4mmRZM8DmsVx0",
  authDomain: "spruces-app-bff67.firebaseapp.com",
  projectId: "spruces-app-bff67",
  storageBucket: "spruces-app-bff67.appspot.com",
  messagingSenderId: "725151975956",
  appId: "1:725151975956:web:f9041edc982c7eafe67501"
};


// Initialize Firebase for the client
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Admin SDK for the server
const adminApp = getAdminApp();

export { app, auth, db, storage, adminApp, firebaseConfig };
