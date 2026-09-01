import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../lib/supabase";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const bookmark = await fetchIsBookMarked(supabase, user.id, Number(movieId));

  return NextResponse.json(bookmark);
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { movieId, title, overview, backdrop, poster, type, status } = body;

  if (!movieId || !title || !type || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const result = await addBookMark(
    supabase,
    user.id,
    Number(movieId),
    title,
    overview || "",
    backdrop || "",
    poster || "",
    type,
    status,
  );

  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json({ error: "movieId required" }, { status: 400 });
  }

  const result = await removeBookMark(supabase, user.id, Number(movieId));

  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { movieId, status } = body;

    if (!movieId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const updateBookmark = await UpdateBookMark(
      supabase,
      user.id,
      Number(movieId),
      status,
    );

    return NextResponse.json({ success: true, data: updateBookmark });
  } catch (error) {
    console.error("PUT /api/bookmark error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function fetchIsBookMarked(
  supabase: any,
  userID: string,
  movieID: number,
) {
  const { data, error } = await supabase
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

export async function removeBookMark(
  supabase: any,
  userID: string,
  movieID: number,
) {
  try {
    const { error } = await supabase
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
  supabase: any,
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
    const { error: movieError } = await supabase.from("movies").upsert({
      movie_id: movieID,
      title,
      overview,
      poster_path: poster,
      backdrop_path: backdrop,
      type,
    });

    if (movieError) throw movieError;

    // 2️⃣ Upsert bookmark
    const { error: bookmarkError } = await supabase.from("bookmark").upsert(
      {
        user_id: userID,
        movie_id: movieID,
        status,
      },
      { onConflict: "user_id,movie_id" },
    );

    if (bookmarkError) throw bookmarkError;

    return { success: true };
  } catch (err) {
    console.error("❌ Add bookmark error:", err);
    return { success: false };
  }
}

export async function UpdateBookMark(
  supabase: any,
  userID: string,
  movieID: number,
  status: string,
) {
  try {
    const { data, error } = await supabase
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
