import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyATbDsUFfSXR6c-t15Kuub0rwtsTirklqM",
  authDomain:        "sorteador-de-filmes.firebaseapp.com",
  projectId:         "sorteador-de-filmes",
  storageBucket:     "sorteador-de-filmes.firebasestorage.app",
  messagingSenderId: "844495701284",
  appId:             "1:844495701284:web:3d9a74b53d78da11119fb1",
  measurementId:     "G-YP31FSNBZY",
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
