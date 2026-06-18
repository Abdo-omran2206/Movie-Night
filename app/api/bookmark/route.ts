import { NextResponse } from "next/server";
import { getUserSession } from "../lib/getUserSession";
import { supabaseClient } from "@/lib/supabase";

export async function GET(req: Request) {
  const { success, userId } = await getUserSession();

  if (!success || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  try {
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { movieId, title, overview, backdrop, poster, type, status } = body;

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

export async function PUT(req: Request) {
  const { success, userId } = await getUserSession();

  if (!success || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { movieId, status } = body;

    const UpdateBookmark = await UpdateBookMark(
      userId,
      Number(movieId),
      status,
    );
    if (!UpdateBookmark) {
      return NextResponse.json({ success: false });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/bookmark error:", error);
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
  try {
    const { error } = await supabaseClient
      .from("bookmark")
      .delete()
      .eq("user_id", userID)
      .eq("movie_id", movieID);

    if (error) {
      console.error("❌ Error removing bookmark:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { success: false };
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
    return { success: false };
  }
}

export async function UpdateBookMark(
  userID: string,
  movieID: number,
  status: string,
) {
  try {
    const { data, error } = await supabaseClient
      .from("bookmark")
      .update({ status })
      .eq("movie_id", movieID)
      .eq("user_id", userID);

    if (error) {
      console.error("❌ Supabase error:", error);
      return { success: false };
    }

    return { success: true, data };
  } catch (err) {
    console.error("❌ update bookmark error:", err);
    return { success: false };
  }
}
