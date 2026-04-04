// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUVW2d7L1lYHnBRJL0viwU6wMiZFCbq9w",
  authDomain: "bdython.firebaseapp.com",
  databaseURL: "https://bdython-default-rtdb.firebaseio.com",
  projectId: "bdython",
  storageBucket: "bdython.firebasestorage.app",
  messagingSenderId: "1004013065547",
  appId: "1:1004013065547:web:7a89264158b264c13804ce",
  measurementId: "G-8JFB9M2G5B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Session ID from URL param (?s=mysession) or default "live"
const urlParams = new URLSearchParams(window.location.search);
const SESSION_ID = urlParams.get('s') || 'live';
