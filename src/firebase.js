// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So",
  authDomain: "locket-4252a.firebaseapp.com",
  projectId: "locket-4252a",
  storageBucket: "locket-img",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth và Storage
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
