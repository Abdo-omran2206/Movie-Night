import { NextResponse } from "next/server";
import { fetchReviews } from "@/lib/services/tmdb";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;

  if (!slug || slug.length < 2) {
    return NextResponse.json(
      { error: "Type and ID are required" },
      { status: 400 }
    );
  }

  const type = slug[0];
  const id = Number(slug[1]);

  // validate type
  if (type !== "movie" && type !== "tv") {
    return NextResponse.json(
      { error: "Invalid type (must be movie or tv)" },
      { status: 400 }
    );
  }

  // validate id
  if (!id || isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    );
  }

  try {
    const result = await fetchReviews(id, type);

    return NextResponse.json({
      results: result,
    });
  } catch (error) {
    console.error("DYNAMIC API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}