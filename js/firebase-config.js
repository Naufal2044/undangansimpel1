/* ============================================================
   FIREBASE CONFIGURATION — BUKU TAMU ONLINE (RIYA & RIMA)
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCfIe5JXI68YoGrKhaosWJaFtOo3XMmrq4",
  authDomain:        "undangan-riya-rima-50138.firebaseapp.com",
  projectId:         "undangan-riya-rima-50138",
  storageBucket:     "undangan-riya-rima-50138.firebasestorage.app",
  messagingSenderId: "1045223422157",
  appId:             "1:1045223422157:web:ae524cb2e4aa9a5a799184"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

export { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp };
