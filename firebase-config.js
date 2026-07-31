/**
 * Once Gown Admin - Firebase Configuration & Real-Time Sync
 * Connected to Firebase Project: oncegown-fb1fc
 */

const firebaseConfig = {
  apiKey: "AIzaSyDjP1_MBSaMwK5iKVXHN8hpATQbyG7oDfc",
  authDomain: "oncegown-fb1fc.firebaseapp.com",
  projectId: "oncegown-fb1fc",
  storageBucket: "oncegown-fb1fc.firebasestorage.app",
  messagingSenderId: "22004551283",
  appId: "1:22004551283:web:08cb7489ccdaf43ba02406",
  measurementId: "G-GVFH1SV089"
};

let firebaseApp = null;
let db = null;
let auth = null;

function initAdminFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
      } else {
        firebaseApp = firebase.app();
      }
      db = firebase.firestore();
      auth = firebase.auth();
      console.log('✨ [Once Gown Admin] Connected to Firebase Backend successfully!');
    }
  } catch (err) {
    console.error('❌ [Admin] Firebase Init Error:', err);
  }
}

initAdminFirebase();
