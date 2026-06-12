import { supabaseClient } from "../supabase";

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

export async function fetchStatusCount(
  userId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching bookmarks:", error);
    return {} as Record<string, number>;
  }

  const counts: Record<string, number> = {};

  data?.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });

  return counts;
}

export async function fetchNewBookmarks(
  userId: string,
): Promise<BookmarkData[]> {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .select(
      `
        status,
        created_at,
        movies (
          movie_id,
          title,
          overview,
          poster_path,
          backdrop_path,
          type
        )
      `,
    )
    .range(0, 4)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching new bookmarks:", error);
    return [];
  }

  // Cast safety structure
  const formattedData = (data as unknown as BookmarkData[]) || [];
  return formattedData;
}

export async function fetchIsBookMarked(userID: string, movieID: number) {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .select("movie_id,status")
    .eq("user_id", userID)
    .eq("movie_id", movieID);
  if (error) {
    console.error("Error fetching bookmark status:", error);
    return [];
  }
  if (data.length != 0) {
    return data;
  }
  return [];
}

export async function removeBookMark(userID: string, movieID: number) {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .delete()
    .eq("user_id", userID)
    .eq("movie_id", movieID);

  if (error) {
    console.error("Error removing bookmark:", error);
    return false;
  }

  return [];
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
    // 1️⃣ Upsert movie
    const { error: movieError } = await supabaseClient.from("movies").upsert({
      movie_id: movieID,
      title: title,
      overview: overview,
      poster_path: poster,
      backdrop_path: backdrop,
      type: type,
    });
    if (movieError) throw movieError;
    // 2️⃣ Upsert bookmark
    const { error: bookmarkError } = await supabaseClient
      .from("bookmark")
      .upsert(
        {
          user_id: userID,
          movie_id: movieID,
          status: status,
        },
        { onConflict: "user_id,movie_id" },
      );

    if (bookmarkError) throw bookmarkError;
  } catch (err) {
    console.error("❌ Add bookmark error:", err);
  }
}
