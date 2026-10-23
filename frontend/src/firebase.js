import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLSYXasv-tS6GklngyBByFWJgyiz9q_c8",
  authDomain: "persona-prime-d1e67.firebaseapp.com",
  projectId: "persona-prime-d1e67",
  storageBucket: "persona-prime-d1e67.firebasestorage.app",
  messagingSenderId: "777802373847",
  appId: "1:777802373847:web:d31dd41e7092a921c92e92"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
