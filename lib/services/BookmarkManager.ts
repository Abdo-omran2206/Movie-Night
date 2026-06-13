export interface BookmarkData {
  status: string;
  created_at: string;
  movies: {
    movie_id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    type: string;
  } | null;
}

export async function fetchStatusCount(userId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/bookmark?action=count&userId=${encodeURIComponent(userId)}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching status count:", error);
    return {};
  }
}

export async function fetchNewBookmarks(userId: string): Promise<BookmarkData[]> {
  try {
    const res = await fetch(`/api/bookmark?action=new&userId=${encodeURIComponent(userId)}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching new bookmarks:", error);
    return [];
  }
}

export async function fetchIsBookMarked(userID: string, movieID: number) {
  try {
    const res = await fetch(`/api/bookmark?userId=${encodeURIComponent(userID)}&movieId=${movieID}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching is bookmarked:", error);
    return [];
  }
}

export async function removeBookMark(userID: string, movieID: number) {
  try {
    const res = await fetch(`/api/bookmark?userId=${encodeURIComponent(userID)}&movieId=${movieID}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return [];
  }
}

export async function addBookMark(
  userID: string,
  movieID: number,
  title: string,
  overview: string,
  backdrop: string,
  poster: string,
  type: "movie" | "tv",
  status: string,
) {
  try {
    await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userID,
        movieId: movieID,
        title,
        overview,
        backdrop,
        poster,
        type,
        status,
      }),
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
  }
}
