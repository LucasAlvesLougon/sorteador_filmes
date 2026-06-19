import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Live binding — quem importar sempre lê o valor atual
export let currentUser = null;

/**
 * Inicia o listener de autenticação.
 * @param {{ onSignedIn: (user) => void, onSignedOut: () => void }} callbacks
 */
export function initAuth(callbacks) {
  onAuthStateChanged(auth, user => {
    currentUser = user;
    if (user) callbacks.onSignedIn(user);
    else       callbacks.onSignedOut();
  });
}

export async function signInEmail(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signUpEmail(email, password) {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInGoogle() {
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export function logout() {
  return signOut(auth);
}
