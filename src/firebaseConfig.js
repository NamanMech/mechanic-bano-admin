// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBc1bRjPiMC0LCCht-wZGTDY5RTLC_Eo0U",
  authDomain: "mechanicbanopublic.firebaseapp.com",
  projectId: "mechanicbanopublic",
  storageBucket: "mechanicbanopublic.firebasestorage.app",
  messagingSenderId: "303726026304",
  appId: "1:303726026304:web:46a128903e164cea2209a5"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
