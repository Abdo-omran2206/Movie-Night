import { BookmarkData } from "@/constant/types";

export async function fetchStatusCount(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/bookmark?action=count`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching status count:", error);
    return {};
  }
}

export async function fetchNewBookmarks(): Promise<BookmarkData[]> {
  try {
    const res = await fetch(`/api/bookmark?action=new`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching new bookmarks:", error);
    return [];
  }
}

export async function fetchIsBookMarked(movieID: number) {
  try {
    const res = await fetch(`/api/bookmark?movieId=${movieID}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching is bookmarked:", error);
    return [];
  }
}

export async function removeBookMark(movieID: number) {
  try {
    const res = await fetch(`/api/bookmark?movieId=${movieID}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return [];
  }
}

export async function addBookMark(
  movieID: number,
  title: string,
  overview: string,
  backdrop: string,
  poster: string,
  type: "movie" | "tv",
  status: string,
) {
  try {
    const data = await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId: movieID,
        title,
        overview,
        backdrop,
        poster,
        type,
        status,
      }),
    });
    return await data.json();
  } catch (error) {
    console.error("Error adding bookmark:", error);
  }
}

export async function UpdateBookMark(movieID: number, status: string) {
  try {
    const data = await fetch("/api/bookmark", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId: movieID,
        status,
      }),
    });
    return await data.json();
  } catch (error) {
    console.error("Error update bookmark:", error);
  }
}
