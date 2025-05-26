import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  //main db
  apiKey: "AIzaSyDGeTS_b0SPSNtX6uSqguJx-cOJ4ndkVh0",
  authDomain: "tamizha-task-allocation-status.firebaseapp.com",
  projectId: "tamizha-task-allocation-status",
  storageBucket: "tamizha-task-allocation-status.firebasestorage.app",
  messagingSenderId: "306038736104",
  appId: "1:306038736104:web:af188eda094a4caaa0b55d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const storage = getStorage(app); 
const auth = getAuth(app); 
const firestore = getFirestore(app);
export { db, storage, auth , firestore}; 
