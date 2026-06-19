import { auth } from "./firebase.js";
import {
  currentUser, initAuth, signInEmail, signUpEmail, signInGoogle, logout,
} from "./auth.js";
import {
  movies,
  setupMoviesSubscription, unsubscribeMovies,
  addMovie, removeMovie, toggleWatched,
  subscribeToComments, addComment, updateComment, deleteComment,
  refreshAllMovies,
} from "./movies.js";

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
// Telas
const authScreen  = document.getElementById("authScreen");
const listScreen  = document.getElementById("listScreen");
const appScreen   = document.getElementById("appScreen");

// Formulário de autenticação
const authForm          = document.getElementById("authForm");
const googleAuthBtn     = document.getElementById("googleAuthBtn");
const authEmailInput    = document.getElementById("authEmail");
const authPasswordInput = document.getElementById("authPassword");
const authTitle         = document.getElementById("authTitle");
const authSubtitle      = document.getElementById("authSubtitle");
const authSubmitBtn     = document.getElementById("authSubmitBtn");
const authSwitchBtn     = document.getElementById("authSwitchBtn");
const authSwitchText    = document.getElementById("authSwitchText");
const backToLoginBtn    = document.getElementById("backToLoginBtn");

// Tela de listas
const createListBtn = document.getElementById("createListBtn");
const joinListForm  = document.getElementById("joinListForm");
const joinListInput = document.getElementById("joinListInput");

// Barra do app
const listCodeDisplay = document.getElementById("listCodeDisplay");
const leaveListBtn    = document.getElementById("leaveListBtn");
const logoutBtn       = document.getElementById("logoutBtn");

// Formulário e lista de filmes
const form        = document.getElementById("addForm");
const input       = document.getElementById("movieInput");
const formError   = document.getElementById("formError");
const listEl      = document.getElementById("list");
const filtersEl   = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const drawBtn     = document.getElementById("drawBtn");
const refreshBtn  = document.getElementById("refreshMoviesBtn");

// Contadores
const countAllEl       = document.getElementById("countAll");
const countUnwatchedEl = document.getElementById("countUnwatched");
const countWatchedEl   = document.getElementById("countWatched");

// Modal de sorteio
const drawModalOverlay = document.getElementById("drawModalOverlay");
const drawModalTitle   = document.getElementById("drawModalTitle");
const drawModalPoster  = document.getElementById("drawModalPoster");
const drawModalClose   = document.getElementById("drawModalClose");
const drawModalMark    = document.getElementById("drawModalMarkWatched");

// Modal de informações
const infoModalOverlay  = document.getElementById("infoModalOverlay");
const infoModalClose    = document.getElementById("infoModalClose");
const infoModalPoster   = document.getElementById("infoModalPoster");
const infoModalTitle    = document.getElementById("infoModalTitle");
const infoModalGenres   = document.getElementById("infoModalGenres");
const infoModalMeta     = document.getElementById("infoModalMeta");
const infoModalSynopsis = document.getElementById("infoModalSynopsis");
const commentsList      = document.getElementById("commentsList");
const starRatingInput   = document.getElementById("starRatingInput");
const commentInput      = document.getElementById("commentInput");
const submitCommentBtn  = document.getElementById("submitCommentBtn");
const commentFormLabel  = document.getElementById("commentFormLabel");
const cancelEditBtn     = document.getElementById("cancelEditBtn");

// Toast
const toastEl = document.getElementById("toast");

/* =========================================================
   ESTADO
   ========================================================= */
let currentFilter   = "all";
let searchQuery     = "";
let lastDrawnId     = null;
let isSignUpMode    = false;
let currentListCode = localStorage.getItem("@sorteador:listCode") || null;

let infoModalMovieId  = null;
let unsubComments     = null;
let selectedRating    = 0;
let editingCommentId  = null; // null = novo | string = editando

/* =========================================================
   UTILS
   ========================================================= */
function escapeHTML(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function showToast(message, duration = 2600) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("show"), duration);
}

function showFormError(message) {
  formError.textContent = message;
  if (message) {
    clearTimeout(showFormError._t);
    showFormError._t = setTimeout(() => { formError.textContent = ""; }, 3000);
  }
}

function generateListCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function formatRuntime(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}min` : `${m}min`;
}

function renderStars(rating, max = 5) {
  if (!rating) return "";
  return Array.from({ length: max }, (_, i) => i < rating ? "★" : "☆").join("");
}

function formatDate(ts) {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch { return ""; }
}

/* =========================================================
   TELAS
   ========================================================= */
function showScreen(id) {
  [authScreen, listScreen, appScreen].forEach(el => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* =========================================================
   AUTENTICAÇÃO
   ========================================================= */
authSwitchBtn.addEventListener("click", () => {
  isSignUpMode = !isSignUpMode;
  if (isSignUpMode) {
    authTitle.textContent     = "Criar uma Conta";
    authSubtitle.textContent  = "Cadastre-se para usar o aplicativo.";
    authSubmitBtn.textContent = "Cadastrar";
    authSwitchText.textContent = "Já possui uma conta?";
    authSwitchBtn.textContent  = "Entrar";
  } else {
    authTitle.textContent     = "Entrar no Sorteador";
    authSubtitle.textContent  = "Acesse com sua conta individual.";
    authSubmitBtn.textContent = "Entrar";
    authSwitchText.textContent = "Não tem uma conta?";
    authSwitchBtn.textContent  = "Criar conta";
  }
  authForm.reset();
});

authForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email    = authEmailInput.value.trim();
  const password = authPasswordInput.value;
  if (!email || !password) return showToast("⚠️ Preencha todos os campos.");
  try {
    authSubmitBtn.disabled = true;
    if (isSignUpMode) {
      await signUpEmail(email, password);
      showToast("✨ Conta criada!");
    } else {
      await signInEmail(email, password);
    }
  } catch {
    showToast("⚠️ Erro: verifique seus dados.");
  } finally {
    authSubmitBtn.disabled = false;
  }
});

googleAuthBtn.addEventListener("click", async () => {
  try {
    googleAuthBtn.disabled = true;
    await signInGoogle();
  } catch (err) {
    if (err?.code !== "auth/popup-closed-by-user")
      showToast("⚠️ Falha ao entrar com Google.");
  } finally {
    googleAuthBtn.disabled = false;
  }
});

backToLoginBtn.addEventListener("click", () => logout());
logoutBtn.addEventListener("click",      () => logout());

leaveListBtn.addEventListener("click", () => {
  currentListCode = null;
  localStorage.removeItem("@sorteador:listCode");
  unsubscribeMovies();
  showScreen("listScreen");
});

initAuth({
  onSignedIn() {
    if (currentListCode) enterApp(currentListCode);
    else showScreen("listScreen");
  },
  onSignedOut() {
    currentListCode = null;
    unsubscribeMovies();
    showScreen("authScreen");
  },
});

/* =========================================================
   GERENCIAMENTO DE LISTAS
   ========================================================= */
createListBtn.addEventListener("click", () => {
  const code = generateListCode();
  enterApp(code);
  showToast(`Sala ${code} criada com sucesso!`);
});

joinListForm.addEventListener("submit", e => {
  e.preventDefault();
  const code = joinListInput.value.trim().toUpperCase();
  if (code) enterApp(code);
});

function enterApp(code) {
  currentListCode = code;
  localStorage.setItem("@sorteador:listCode", code);
  listCodeDisplay.textContent = code;
  showScreen("appScreen");
  setupMoviesSubscription(code, render, err => {
    console.error("Firestore:", err);
    if (err.code === "permission-denied")
      showToast("⚠️ Sem permissão. Verifique as Regras do Firebase.");
  });
  joinListInput.value = "";
}

/* =========================================================
   FORMULÁRIO DE FILMES
   ========================================================= */
form.addEventListener("submit", async e => {
  e.preventDefault();
  const result = await addMovie(input.value, currentListCode, currentUser?.uid);
  if (result.ok) {
    input.value = "";
    input.focus();
  } else if (result.error === "duplicate") {
    showFormError("Filme já está na lista.");
  } else if (result.error !== "empty") {
    showToast("⚠️ Erro ao salvar filme.");
  }
});

input.addEventListener("input", () => { formError.textContent = ""; });

/* =========================================================
   FILTROS E BUSCA
   ========================================================= */
filtersEl.addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  document.querySelectorAll(".filter-btn")
    .forEach(b => b.classList.toggle("active", b === btn));
  render();
});

searchInput.addEventListener("input", e => {
  searchQuery = e.target.value.trim().toLowerCase();
  render();
});

/* =========================================================
   ATUALIZAR DADOS VIA TMDB
   ========================================================= */
refreshBtn.addEventListener("click", async () => {
  if (!currentListCode) return;
  const total = movies.length;
  if (!total) return showToast("Lista vazia.");

  refreshBtn.disabled    = true;
  refreshBtn.textContent = "🔄 Atualizando…";

  await refreshAllMovies(currentListCode, (i, t, title) => {
    showToast(`🔄 ${i}/${t}: ${title}`, 1400);
  });

  refreshBtn.disabled    = false;
  refreshBtn.textContent = "🔄 Atualizar filmes";
  showToast(`✅ ${total} filme${total !== 1 ? "s" : ""} atualizado${total !== 1 ? "s" : ""}!`, 3000);
});

/* =========================================================
   RENDER
   ========================================================= */
function getFiltered() {
  let list = movies;
  if (currentFilter === "unwatched") list = list.filter(m => !m.watched);
  else if (currentFilter === "watched") list = list.filter(m => m.watched);
  if (searchQuery) list = list.filter(m => m.title.toLowerCase().includes(searchQuery));
  return list;
}

function render() {
  const total     = movies.length;
  const unwatched = movies.filter(m => !m.watched).length;
  const watched   = total - unwatched;

  countAllEl.textContent       = total     ? `(${total})`     : "";
  countUnwatchedEl.textContent = unwatched ? `(${unwatched})` : "";
  countWatchedEl.textContent   = watched   ? `(${watched})`   : "";

  const filtered = getFiltered();

  if (!filtered.length) {
    if (!movies.length)
      listEl.innerHTML = `<div class="empty-state"><span class="big">🍿</span>Lista vazia.</div>`;
    else if (currentFilter === "unwatched" && !searchQuery)
      listEl.innerHTML = `<div class="empty-state"><span class="big">✅</span>Você já assistiu tudo!</div>`;
    else if (searchQuery)
      listEl.innerHTML = `<div class="empty-state"><span class="big">🔍</span>Nenhum resultado para "${escapeHTML(searchQuery)}".</div>`;
    else
      listEl.innerHTML = `<div class="empty-state"><span class="big">👀</span>Nenhum filme assistido.</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(m => `
    <article class="movie-card ${m.watched ? "watched" : ""}" data-id="${m.id}">
      <button class="status-toggle" type="button" data-action="toggle">${m.watched ? "✓" : ""}</button>
      <img src="${m.posterUrl || ""}" class="movie-poster" alt="Poster" loading="lazy" data-action="info">
      <span class="movie-title" data-action="info">${escapeHTML(m.title)}</span>
      <span class="movie-badge">${m.watched ? "Assistido" : "Não assistido"}</span>
      <button class="delete-btn" type="button" data-action="delete" aria-label="Remover">✕</button>
    </article>
  `).join("");
}

/* =========================================================
   EVENTOS DOS CARDS
   ========================================================= */
listEl.addEventListener("click", e => {
  const card   = e.target.closest(".movie-card");
  if (!card) return;
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "toggle") toggleWatched(card.dataset.id, currentListCode);
  if (action === "delete") removeMovie(card.dataset.id, currentListCode);
  if (action === "info")   openInfoModal(card.dataset.id);
});

/* =========================================================
   SORTEIO
   ========================================================= */
drawBtn.addEventListener("click", () => {
  const pool = movies.filter(m => !m.watched);
  if (!pool.length) return showToast("🎬 Nenhum filme para sortear!");

  const labelEl = drawBtn.querySelector(".label");
  const reelEl  = drawBtn.querySelector(".reel");
  const emojis  = ["🎬", "🍿", "🎥", "🎞️", "⭐", "📺"];

  drawBtn.disabled = true;
  drawBtn.classList.add("suspense-active");

  let elapsed  = 0;
  const total  = 3500;
  let interval = 120;

  function tick() {
    const r = pool[Math.floor(Math.random() * pool.length)];
    labelEl.textContent = r.title;
    reelEl.textContent  = emojis[Math.floor(Math.random() * emojis.length)];
    elapsed += interval;

    if (elapsed > total * 0.70) interval = 250;
    if (elapsed > total * 0.88) interval = 450;

    if (elapsed < total) {
      setTimeout(tick, interval);
    } else {
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      lastDrawnId = chosen.id;

      drawModalTitle.textContent = chosen.title;
      drawModalPoster.src        = chosen.posterUrl || "";
      drawModalOverlay.classList.add("open");
      document.body.style.overflow = "hidden";

      drawBtn.disabled = false;
      drawBtn.classList.remove("suspense-active");
      labelEl.textContent = "Sortear Filme";
      reelEl.textContent  = "🎞️";
    }
  }
  tick();
});

/* =========================================================
   MODAL DE SORTEIO
   ========================================================= */
drawModalClose.addEventListener("click", closeDrawModal);
drawModalOverlay.addEventListener("click", e => {
  if (e.target === drawModalOverlay) closeDrawModal();
});
drawModalMark.addEventListener("click", () => {
  if (lastDrawnId) toggleWatched(lastDrawnId, currentListCode);
  closeDrawModal();
});

function closeDrawModal() {
  drawModalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  lastDrawnId = null;
}

/* =========================================================
   MODAL DE INFORMAÇÕES
   ========================================================= */
function openInfoModal(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;

  infoModalMovieId = movieId;

  // Preenche o cabeçalho
  infoModalPoster.src           = movie.posterUrl || "";
  infoModalTitle.textContent    = movie.title;
  infoModalSynopsis.textContent = movie.synopsis || "Sinopse não disponível.";

  // Gêneros
  infoModalGenres.innerHTML = movie.genres.length
    ? movie.genres.map(g => `<span class="genre-badge">${escapeHTML(g)}</span>`).join("")
    : "";

  // Metadados: ano · duração · nota TMDB
  const parts = [];
  if (movie.releaseYear) parts.push(movie.releaseYear);
  const rt = formatRuntime(movie.runtime);
  if (rt) parts.push(rt);
  if (movie.tmdbRating) parts.push(`⭐ ${movie.tmdbRating}`);
  infoModalMeta.textContent = parts.join(" · ");

  // Reset formulário de comentário
  cancelEdit();
  commentsList.innerHTML = `<p class="comments-loading">Carregando avaliações…</p>`;

  // Subscreve aos comentários em tempo real
  if (unsubComments) unsubComments();
  unsubComments = subscribeToComments(currentListCode, movieId, renderComments);

  infoModalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeInfoModal() {
  infoModalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  infoModalMovieId = null;
  if (unsubComments) { unsubComments(); unsubComments = null; }
}

infoModalClose.addEventListener("click", closeInfoModal);
infoModalOverlay.addEventListener("click", e => {
  if (e.target === infoModalOverlay) closeInfoModal();
});

// Ações sobre comentários (editar / excluir)
commentsList.addEventListener("click", async e => {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;
  const item = actionEl.closest(".comment-item");
  if (!item) return;
  const commentId = item.dataset.commentId;
  const action    = actionEl.dataset.action;

  if (action === "edit-comment") {
    const header = actionEl.closest(".comment-header");
    const stars  = header.querySelector(".comment-stars").textContent;
    const rating = [...stars].filter(ch => ch === "★").length;
    const textEl = item.querySelector(".comment-text");
    enterEditMode({ id: commentId, rating, text: textEl?.textContent || "" });
  }

  if (action === "delete-comment") {
    if (!confirm("Excluir esta avaliação?")) return;
    try {
      await deleteComment(currentListCode, infoModalMovieId, commentId);
      showToast("🗑️ Avaliação excluída.");
    } catch (err) {
      console.error("deleteComment:", err);
      showToast("⚠️ Erro ao excluir. Verifique as permissões.");
    }
  }
});

/* ─── Star rating input ─────────────────────────────────── */
starRatingInput.addEventListener("click", e => {
  const btn = e.target.closest(".star-btn");
  if (!btn) return;
  selectedRating = parseInt(btn.dataset.value, 10);
  updateStarUI();
});

starRatingInput.addEventListener("mouseover", e => {
  const btn = e.target.closest(".star-btn");
  if (!btn) return;
  const hover = parseInt(btn.dataset.value, 10);
  starRatingInput.querySelectorAll(".star-btn")
    .forEach((s, i) => s.classList.toggle("hovered", i < hover));
});

starRatingInput.addEventListener("mouseleave", () => {
  starRatingInput.querySelectorAll(".star-btn")
    .forEach(s => s.classList.remove("hovered"));
});

function updateStarUI() {
  starRatingInput.querySelectorAll(".star-btn")
    .forEach((s, i) => s.classList.toggle("selected", i < selectedRating));
}

function enterEditMode(comment) {
  editingCommentId = comment.id;
  selectedRating   = comment.rating || 0;
  commentInput.value = comment.text || "";
  updateStarUI();
  commentFormLabel.textContent  = "✏️ Editando avaliação";
  submitCommentBtn.textContent  = "Atualizar";
  cancelEditBtn.classList.remove("hidden");
  commentInput.focus();
  commentInput.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cancelEdit() {
  editingCommentId = null;
  selectedRating   = 0;
  commentInput.value = "";
  updateStarUI();
  commentFormLabel.textContent = "Sua Avaliação";
  submitCommentBtn.textContent = "Enviar Avaliação";
  cancelEditBtn.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", cancelEdit);

/* ─── Enviar comentário ─────────────────────────────────── */
submitCommentBtn.addEventListener("click", async () => {
  // auth.currentUser é sempre preciso (não depende de live binding entre módulos)
  const user = auth.currentUser;
  if (!user) return showToast("⚠️ Sessão expirada. Faça login novamente.");
  if (!currentListCode || !infoModalMovieId) return showToast("⚠️ Erro de estado. Feche e reabra o modal.");
  if (!selectedRating) return showToast("⚠️ Selecione uma nota de 1 a 5 estrelas.");

  submitCommentBtn.disabled = true;
  try {
    if (editingCommentId) {
      await updateComment(
        currentListCode, infoModalMovieId,
        editingCommentId,
        commentInput.value, selectedRating
      );
      showToast("✅ Avaliação atualizada!");
    } else {
      const name = user.displayName
        || user.email?.split("@")[0]
        || "Anônimo";
      await addComment(
        currentListCode, infoModalMovieId,
        user.uid, name,
        commentInput.value, selectedRating
      );
      showToast("✅ Avaliação enviada!");
    }
    cancelEdit();
  } catch (err) {
    console.error("comment error:", err);
    if (err?.code === "permission-denied")
      showToast("⚠️ Sem permissão. Verifique as regras do Firestore.");
    else
      showToast("⚠️ Erro ao salvar avaliação. Tente novamente.");
  } finally {
    submitCommentBtn.disabled = false;
  }
});

/* ─── Renderizar comentários ─────────────────────────────── */
function renderComments(comments) {
  if (!comments.length) {
    commentsList.innerHTML = `<p class="comments-empty">Seja o primeiro a avaliar este filme!</p>`;
    return;
  }

  const avg     = comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length;
  const avgDisp = (Math.round(avg * 10) / 10).toFixed(1);

  commentsList.innerHTML = `
    <div class="comments-avg">
      <span class="comments-avg-stars">${renderStars(Math.round(avg))}</span>
      <span class="comments-avg-label">
        ${avgDisp} · ${comments.length} avaliação${comments.length !== 1 ? "ões" : ""}
      </span>
    </div>
    ${comments.map(c => {
      const isOwner = auth.currentUser?.uid === c.userId;
      return `
      <div class="comment-item" data-comment-id="${c.id}">
        <div class="comment-header">
          <span class="comment-author">${escapeHTML(c.userName || "Anônimo")}</span>
          <span class="comment-stars">${renderStars(c.rating)}</span>
          <span class="comment-date">${formatDate(c.createdAt)}</span>
          ${isOwner ? `
            <button class="comment-edit-btn" data-action="edit-comment" aria-label="Editar">✏️</button>
            <button class="comment-delete-btn" data-action="delete-comment" aria-label="Excluir">🗑️</button>
          ` : ""}
        </div>
        ${c.text ? `<p class="comment-text">${escapeHTML(c.text)}</p>` : ""}
      </div>`;
    }).join("")}
  `;
}

/* =========================================================
   TECLA ESC
   ========================================================= */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (infoModalOverlay.classList.contains("open")) closeInfoModal();
  else if (drawModalOverlay.classList.contains("open"))  closeDrawModal();
});
