// Firebase Configuration
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Create Project" → "Rov Portfolio"
// 3. Skip Analytics (or enable)
// 4. In Project Settings (gear icon), go to "Your apps" section
// 5. Click "Web" icon (</>) to add web app
// 6. Copy the entire config object below and paste here

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSaskP0fU3haf3BUdBD5b19CZF5vIm4pY",
  authDomain: "rov-portfolio.firebaseapp.com",
  projectId: "rov-portfolio",
  storageBucket: "rov-portfolio.firebasestorage.app",
  messagingSenderId: "159765368120",
  appId: "1:159765368120:web:f4a8221ad1dd732b5a45cd",
  measurementId: "G-KJHXVE5HW7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase initialized successfully!");
