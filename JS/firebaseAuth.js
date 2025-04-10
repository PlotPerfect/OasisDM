
// ✅ Firebase Config Object
const firebaseConfig = {
    apiKey: "AIzaSyAY90PUqfn9AH0dF3qqclWg9lRtcFYsLWM",
    authDomain: "oasis-data-management.firebaseapp.com",
    projectId: "oasis-data-management",
    storageBucket: "oasis-data-management.firebasestorage.app",
    messagingSenderId: "858429767893",
    appId: "1:858429767893:web:54708e4ce969c893d0a25c",
    measurementId: "G-HHRCFNM50N"
  };
  
  // ✅ Initialize Firebase App
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized.");
  } else {
    console.log("ℹ️ Firebase already initialized.");
  }
  
  // ✅ Initialize Firebase Authentication
  const auth = firebase.auth();
  const db = firebase.firestore();

  console.log("✅ Firebase Auth initialized:", auth);
  
  // Optional: Monitor auth state
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("👤 User signed in:", user.phoneNumber || user.email || user.uid);
    } else {
      console.log("🔒 No user signed in.");
    }
  });
  