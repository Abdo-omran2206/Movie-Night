import { NextResponse } from "next/server";
import { getUserSession } from "../lib/getUserSession";
import { supabaseClient } from "@/lib/supabase";
import { BookmarkData } from "@/constant/types";

export async function GET(req: Request) {
  const { success, userId } = await getUserSession();

  if (!success || !userId) {
    return NextResponse.json(
      { error: "Unauthorized", message: userId },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const action = searchParams.get("action");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    if (action === "count") {
      const counts = await fetchStatusCount(userId);
      return NextResponse.json(counts);
    }

    if (action === "new") {
      const newBookmarks = await fetchNewBookmarks(userId);
      return NextResponse.json(newBookmarks);
    }

    if (movieId) {
      const bookmark = await fetchIsBookMarked(userId, Number(movieId));
      return NextResponse.json(bookmark);
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("GET /api/bookmark error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { success, userId } = await getUserSession();

  if (!success || !userId) {
    return NextResponse.json(
      { error: "Unauthorized", message: userId },
      { status: 401 },
    );
  }
  try {
    const body = await req.json();
    const { movieId, title, overview, backdrop, poster, type, status } =
      body;

    if (!userId || !movieId || !title || !type || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const addbookmark = await addBookMark(
      userId,
      Number(movieId),
      title,
      overview || "",
      backdrop || "",
      poster || "",
      type,
      status,
    );
    if (!addbookmark) {
      return NextResponse.json({ success: false });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/bookmark error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const { success, userId } = await getUserSession();

  if (!success || !userId) {
    return NextResponse.json(
      { error: "Unauthorized", message: userId },
      { status: 401 },
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "userId and movieId are required" },
        { status: 400 },
      );
    }

    const removebookmark = await removeBookMark(userId, Number(movieId));
    if (!removebookmark) {
      return NextResponse.json({ success: false });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookmark error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
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

  return true;
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
    return true;
  } catch (err) {
    console.error("❌ Add bookmark error:", err);
  }
}

async function fetchStatusCount(userId: string) {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return {};
  }

  const counts: Record<string, number> = {};

  data?.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });

  return counts;
}

export async function fetchNewBookmarks(userId: string) {
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
