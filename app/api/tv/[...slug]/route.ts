import { NextResponse } from "next/server";
import { fetchTvDetails, fetchTvSeasonDetails } from "@/lib/services/tmdb";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;

  if (!slug || slug.length === 0) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const tvId = slug[0];

    if (slug.length === 1) {
      const tvData = await fetchTvDetails(tvId);
      return NextResponse.json(tvData);
    } else {
      const season = slug[1];
      const tvData = await fetchTvSeasonDetails(tvId, season);
      return NextResponse.json(tvData);
    }
  } catch (error) {
    console.error("DYNAMIC API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}