import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics"; // me added this for analytics, you can remove if not needed


const firebaseConfig = {
  apiKey: "AIzaSyAarzR_dz2EtRuIkvaqHuWrg9TfURovjjo",
  authDomain: "wishlistpage-rustomjeeclifttow.firebaseapp.com",
  projectId: "wishlistpage-rustomjeeclifttow",
  storageBucket: "wishlistpage-rustomjeeclifttow.firebasestorage.app",
  messagingSenderId: "82326933504",
  appId: "1:82326933504:web:bb14f61d34e04f62a6c8e5",
  measurementId: "G-CGJV1J2BXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // me added this for analytics, you can remove if not needed

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
