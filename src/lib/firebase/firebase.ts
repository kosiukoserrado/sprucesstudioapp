// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1j3Q6kcwILHGFw2MI8L4mmRZM8DmsVx0",
  authDomain: "spruces-app-bff67.firebaseapp.com",
  projectId: "spruces-app-bff67",
  storageBucket: "spruces-app-bff67.appspot.com",
  messagingSenderId: "725151975956",
  appId: "1:725151975956:web:f9041edc982c7eafe67501"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
