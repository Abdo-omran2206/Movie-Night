import { NextResponse } from "next/server";
import { fetchGenres, fetchTvGenres } from "@/lib/services/tmdb";

export async function GET(req:Request,{ params }: { params: { type: string } }) {
  const { type } = await params;
  try {
    if (type == "movie") {
      const data = await fetchGenres();
      return NextResponse.json(data);
    } else if (type == "tv") {
      const data = await fetchTvGenres();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Use 'movie' or 'tv'" },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json({
      results: [],
      total_pages: 0,
    });
  }
}
