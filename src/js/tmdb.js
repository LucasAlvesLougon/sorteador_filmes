const TMDB_API_KEY  = "7a1dcf62353d2f27e784daeae52443d0";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/";
export const FALLBACK_POSTER = "https://placehold.co/300x450/18181c/9a9aa2?text=%F0%9F%8D%BF";

/**
 * Busca detalhes completos de um filme no TMDB:
 * posterUrl, synopsis, genres, releaseYear, runtime, tmdbRating, tmdbId
 */
export async function fetchMovieDetails(title) {
  const empty = {
    posterUrl:   FALLBACK_POSTER,
    synopsis:    "",
    genres:      [],
    releaseYear: "",
    runtime:     null,
    tmdbRating:  null,
    tmdbId:      null,
  };

  if (!TMDB_API_KEY) return empty;

  try {
    // 1. Busca pelo título
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}` +
      `&query=${encodeURIComponent(title)}&language=pt-BR`
    );
    if (!searchRes.ok) return empty;

    const searchData = await searchRes.json();
    if (!searchData.results?.length) return empty;

    const result    = searchData.results[0];
    const tmdbId    = result.id;
    const posterUrl = result.poster_path
      ? `${TMDB_IMG_BASE}w300${result.poster_path}`
      : FALLBACK_POSTER;

    // overview da busca como fallback (disponível mesmo sem tradução PT-BR)
    const searchOverview = result.overview || "";

    // 2. Busca detalhes completos (gêneros, duração, etc.)
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=pt-BR`
    );
    if (!detailsRes.ok) return { ...empty, posterUrl, tmdbId, synopsis: searchOverview };

    const d = await detailsRes.json();

    // Se o TMDB não tiver tradução PT-BR do overview, usa o da busca (geralmente EN)
    const synopsis = d.overview || searchOverview;

    return {
      posterUrl,
      synopsis,
      genres:      (d.genres || []).map(g => g.name),
      releaseYear: d.release_date?.substring(0, 4) || result.release_date?.substring(0, 4) || "",
      runtime:     d.runtime || null,
      tmdbRating:  d.vote_average
        ? Math.round(d.vote_average * 10) / 10
        : result.vote_average
          ? Math.round(result.vote_average * 10) / 10
          : null,
      tmdbId,
    };
  } catch (err) {
    console.error("Erro TMDB:", err);
    return empty;
  }
}
