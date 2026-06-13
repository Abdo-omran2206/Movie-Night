import { NextResponse } from "next/server";
import { discover } from "@/lib/services/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const allowedTypes = ["movie", "tv"];
  const typeParam = searchParams.get("type") || "movie";
  const type = allowedTypes.includes(typeParam) ? typeParam : "movie";

  const params = Object.fromEntries(searchParams.entries());
  delete params.type;

  // Ensure required properties with defaults
  const page = parseInt(params.page as string) || 1;
  const discoverParams = { ...params, page } as any;

  try {
    const discoverData = await discover(type as "movie" | "tv", discoverParams);

    return NextResponse.json(discoverData);
  } catch (error) {
    console.error("DISCOVER API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}