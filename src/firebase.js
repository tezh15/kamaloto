import { getApp, getApps, initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5VxS7sCeYSMeirjn21NbiAHNk9QuytO4",
  authDomain: "kamalote-a5227.firebaseapp.com",
  projectId: "kamalote-a5227",
  storageBucket: "kamalote-a5227.firebasestorage.app",
  messagingSenderId: "260862394263",
  appId: "1:260862394263:web:b49ae15918efbfff5d8ed2",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
