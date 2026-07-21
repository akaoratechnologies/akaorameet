// Akaora Meet Firebase Web Config
// GitHub Pages static web app uses Firebase Realtime Database for signaling + chat.
window.AKAORA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAXnQFf3EiORl-oZPfADkztfX-5y9PbC0k",
  authDomain: "akaora-meet.firebaseapp.com",
  databaseURL: "https://akaora-meet-default-rtdb.firebaseio.com",
  projectId: "akaora-meet",
  storageBucket: "akaora-meet.firebasestorage.app",
  messagingSenderId: "399414366862",
  appId: "1:399414366862:web:09b26cfa1420acb2766fdf",
  measurementId: "G-3HW9LY14GL"
};

// Optional production TURN/ICE override.
// Leave this commented to use the bundled STUN + fallback TURN list in app.js.
// For the strongest reliability, replace this with your own TURN provider credentials.
// window.AKAORA_ICE_SERVERS = [
//   { urls: "stun:stun.l.google.com:19302" },
//   { urls: "turn:YOUR_TURN_HOST:3478", username: "USERNAME", credential: "PASSWORD" }
// ];
