import { NextResponse } from "next/server";
import { getActorById } from "@/lib/services/tmdb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Actor ID is required" },
      { status: 400 },
    );
  }

  try {
    const actorData = await getActorById(id);

    if (!actorData) {
      return NextResponse.json({ error: "Actor not found" }, { status: 404 });
    }

    return NextResponse.json(actorData);
  } catch (error) {
    console.error("DYNAMIC API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
