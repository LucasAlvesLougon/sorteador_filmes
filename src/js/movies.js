import { db } from "./firebase.js";
import { fetchMovieDetails } from "./tmdb.js";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Estado público — live binding acessível nos módulos que importam este arquivo
export let movies = [];

let unsubMovies = null;

function normalize(str) {
  return str.trim().toLowerCase();
}

export function isDuplicate(title) {
  return movies.some(m => normalize(m.title) === normalize(title));
}

/* ─── Filmes ──────────────────────────────────────────────── */

export function setupMoviesSubscription(listCode, onUpdate, onError) {
  if (unsubMovies) unsubMovies();

  const q = query(
    collection(db, "lists", listCode, "movies"),
    orderBy("createdAt", "desc")
  );

  unsubMovies = onSnapshot(
    q,
    snapshot => {
      movies = snapshot.docs.map(snap => {
        const d = snap.data();
        return {
          id:          snap.id,
          title:       d.title       || "",
          watched:     Boolean(d.watched),
          posterUrl:   d.posterUrl   || "",
          synopsis:    d.synopsis    || "",
          genres:      Array.isArray(d.genres) ? d.genres : [],
          releaseYear: d.releaseYear || "",
          runtime:     d.runtime     ?? null,
          tmdbRating:  d.tmdbRating  ?? null,
          tmdbId:      d.tmdbId      ?? null,
        };
      });
      onUpdate(movies);
    },
    onError
  );
}

export function unsubscribeMovies() {
  if (unsubMovies) { unsubMovies(); unsubMovies = null; }
}

export async function addMovie(rawTitle, listCode, userId) {
  const title = rawTitle.trim();
  if (!title)            return { ok: false, error: "empty" };
  if (isDuplicate(title)) return { ok: false, error: "duplicate" };
  if (!userId || !listCode) return { ok: false, error: "auth" };

  try {
    const details = await fetchMovieDetails(title);
    await addDoc(collection(db, "lists", listCode, "movies"), {
      title,
      watched: false,
      createdAt: serverTimestamp(),
      ...details,
    });
    return { ok: true };
  } catch (err) {
    console.error("addMovie:", err);
    return { ok: false, error: "save" };
  }
}

export async function removeMovie(id, listCode) {
  await deleteDoc(doc(db, "lists", listCode, "movies", id));
}

export async function toggleWatched(id, listCode) {
  const movie = movies.find(m => m.id === id);
  if (!movie) return;
  await updateDoc(doc(db, "lists", listCode, "movies", id), {
    watched: !movie.watched,
  });
}

/* ─── Comentários ─────────────────────────────────────────── */

/**
 * Inscreve em tempo real nos comentários de um filme.
 * Retorna a função de cancelamento (unsubscribe).
 */
export function subscribeToComments(listCode, movieId, onChange) {
  const q = query(
    collection(db, "lists", listCode, "movies", movieId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, snapshot => {
    onChange(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function addComment(listCode, movieId, userId, userName, text, rating) {
  await addDoc(
    collection(db, "lists", listCode, "movies", movieId, "comments"),
    {
      userId,
      userName: userName || "Anônimo",
      text:     text.trim(),
      rating,
      createdAt: serverTimestamp(),
    }
  );
}

export async function updateComment(listCode, movieId, commentId, text, rating) {
  await updateDoc(
    doc(db, "lists", listCode, "movies", movieId, "comments", commentId),
    { text: text.trim(), rating }
  );
}

export async function deleteComment(listCode, movieId, commentId) {
  await deleteDoc(
    doc(db, "lists", listCode, "movies", movieId, "comments", commentId)
  );
}

/**
 * Re-busca dados do TMDB para todos os filmes da lista e atualiza o Firestore.
 * @param {string} listCode
 * @param {(current: number, total: number, title: string) => void} onProgress
 */
export async function refreshAllMovies(listCode, onProgress) {
  const snapshot = [...movies]; // cópia do estado atual
  for (let i = 0; i < snapshot.length; i++) {
    const movie = snapshot[i];
    if (onProgress) onProgress(i + 1, snapshot.length, movie.title);
    try {
      const details = await fetchMovieDetails(movie.title);
      await updateDoc(doc(db, "lists", listCode, "movies", movie.id), details);
    } catch (err) {
      console.error(`Erro ao atualizar "${movie.title}":`, err);
    }
    // pausa genética para não saturar a API do TMDB
    if (i < snapshot.length - 1) {
      await new Promise(r => setTimeout(r, 350));
    }
  }
}
