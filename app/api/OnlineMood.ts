import { supabase } from "./supabase";

/* =========================
   🔐 Auth Helper
========================= */

async function requireUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  return session.user;
}

/* =========================
   ➕ Add / Update Bookmark
========================= */

export async function addBookmark(movie: {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  type: string;
  status: string;
}) {
  try {
    const user = await requireUser();
    if (!user) return; // Silent return if no auth yet

    const { error } = await supabase.from("bookmarks").upsert(
      {
        user_id: user.id,
        movieID: movie.id.toString(),
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        type: movie.type,
        status: movie.status,
      },
      { onConflict: "user_id,movieID" }
    );

    if (error) throw error;
  } catch (error) {
    console.error("❌ Add bookmark error:", error);
  }
}

/* =========================
   📥 Get All Bookmarks
========================= */

export async function getBookmarks() {
  try {
    const user = await requireUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  } catch (error) {
    console.error("❌ Fetch bookmarks error:", error);
    return [];
  }
}

/* =========================
   ❌ Remove One Bookmark
========================= */

export async function removeBookmark(movieID: string) {
  try {
    const user = await requireUser();
    if (!user) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("movieID", movieID)
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Remove bookmark error:", error);
  }
}

/* =========================
   🗑️ Clear All Bookmarks
========================= */

export async function clearBookmarks() {
  try {
    const user = await requireUser();
    if (!user) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Clear bookmarks error:", error);
  }
}

/* =========================
   ✅ Check If Bookmarked
========================= */

export async function isBookmarked(movieID: string) {
  try {
    const user = await requireUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("status")
      .eq("movieID", movieID)
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data?.status ?? null;
  } catch (error) {
    console.error("❌ Bookmark check error:", error);
    return null;
  }
}

/* =========================
   🔄 Update Status
========================= */

export async function updateBookmarkStatus(
  movieID: string,
  status: string
) {
  try {
    const user = await requireUser();
    if (!user) return;

    const { error } = await supabase
      .from("bookmarks")
      .update({ status })
      .eq("movieID", movieID)
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Update bookmark error:", error);
  }
}
