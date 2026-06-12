import { NextResponse } from "next/server";
import { fetchWatchServer } from "@/lib/services/watchServer";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!type || !["movie", "tv"].includes(type)) {
    return NextResponse.json(
      { error: "Type must be 'movie' or 'tv'" },
      { status: 400 }
    );
  }

  try {
    const servers = await fetchWatchServer(type as "movie" | "tv");

    return NextResponse.json(servers);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}