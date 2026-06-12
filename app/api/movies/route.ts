import { NextResponse } from "next/server";
import { fetchMovies } from "@/lib/services/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const endpoint = searchParams.get("endpoint") || "";
  const page = Number(searchParams.get("page") || 1);
  const language = searchParams.get("language") || "en-US";

  try {
    const data = await fetchMovies(endpoint, page, language);

    return NextResponse.json(data);

  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json({
      results: [],
      total_pages: 0,
    });
  }
}
