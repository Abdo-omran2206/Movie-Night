import { NextResponse } from "next/server";
import {
  fetchIsBookMarked,
  fetchStatusCount,
  fetchNewBookmarks,
  addBookMark,
  removeBookMark,
} from "@/lib/services/BookmarkDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, movieId, title, overview, backdrop, poster, type, status } = body;

    if (!userId || !movieId || !title || !type || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await addBookMark(userId, Number(movieId), title, overview || "", backdrop || "", poster || "", type, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/bookmark error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const movieId = searchParams.get("movieId");

    if (!userId || !movieId) {
      return NextResponse.json({ error: "userId and movieId are required" }, { status: 400 });
    }

    await removeBookMark(userId, Number(movieId));
    return NextResponse.json([]);
  } catch (error) {
    console.error("DELETE /api/bookmark error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
