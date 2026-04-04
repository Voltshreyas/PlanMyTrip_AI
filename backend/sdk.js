// sdk.js - Firebase initialization module
// Removed <script> wrapper to allow importing as a normal ES module.

// Import the libraries from CDN just like the original snippet. When bundling with a
// build tool (Webpack/Vite), you would typically install the firebase packages via npm
// and import from 'firebase/app' etc. For a simple static setup, these URLs still work.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration object (same as before)
const firebaseConfig = {
  apiKey: "AIzaSyCQXjca8O0UlyNfRhTj514WkV4_4PJVxfM",
  authDomain: "ai-trip-planner-login.firebaseapp.com",
  projectId: "ai-trip-planner-login",
  storageBucket: "ai-trip-planner-login.firebasestorage.app",
  messagingSenderId: "553658297995",
  appId: "1:553658297995:web:c3dc85bd06ccec1ad1ee8e",
  measurementId: "G-80402J0TJW"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Exports for use elsewhere in the project
export { app, analytics, auth, db };

// Import the libraries from CDN just like the original snippet. When bundling with a
// build tool (Webpack/Vite), you would typically install the firebase packages via npm
// and import from 'firebase/app' etc. For a simple static setup, these URLs still work.

import { auth, db } from '../backend/sdk.js';

