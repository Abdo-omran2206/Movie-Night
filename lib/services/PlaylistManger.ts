const BASE_URL = "/api/dashboard/playlist";

export async function getMyPlaylists() {
  try {
    const res = await fetch(BASE_URL, { credentials: "include" });
    return await res.json();
  } catch (error) {
    console.error("Error fetching status count:", error);
    return {};
  }
}
export async function createPlaylists(
  name: string,
  description: string,
  visibility: "private" | "public" | "unlisted",
) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        visibility,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error Create watchlist:", error);
  }
}
export async function getPlaylistById(playlistId: string) {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    console.error("Error Find watchlist:", error);
  }
}
export async function deletePlaylistById(playlistId: string) {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    console.error("Error Delete watchlist:", error);
  }
}
export async function addMovieToWatchlist(
  movieID: number,
  title: string,
  overview: string,
  backdrop: string,
  poster: string,
  type: "movie" | "tv",
  playlistId: string,
) {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieID,
        title,
        overview,
        backdrop,
        poster,
        type,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
}
export async function deleteMovieFromPlaylist(
  playlistId: string,
  movieID: number,
) {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}/${movieID}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    console.error("Error delete from watchlist:", error);
  }
}
export async function getPublicPlaylists() {
  try {
    const res = await fetch(`${BASE_URL}/public`, { credentials: "include" });
    return await res.json();
  } catch (error) {
    console.error("Error get public watchlist:", error);
  }
}
export async function getPlaylistBySlug(slug: string) {
  try {
    const res = await fetch(`${BASE_URL}/slug/${slug}`, {
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    console.error("Error get watchlist by slug:", error);
  }
}
export async function getPlaylistByToken(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/share/${token}`, {
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    console.error("Error get watchlist by slug:", error);
  }
}
