import { NextResponse } from "next/server";
import { search } from "@/lib/services/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const allowedTypes = ["movie", "tv", "multi"];
  const typeParam = searchParams.get("type") || "multi";
  const type = allowedTypes.includes(typeParam) ? typeParam : "multi";

  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const result = await search(query, page, type);
    return NextResponse.json(result);
  } catch (error) {
    console.error("DYNAMIC API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}