import { NextResponse } from "next/server";
import { getCollectionDetails } from "@/lib/services/tmdb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "collection ID is required" },
      { status: 400 },
    );
  }

  try {
    const collectionData = await getCollectionDetails(id);

    if (!collectionData) {
      return NextResponse.json(
        { error: "collection not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(collectionData);
  } catch (error) {
    console.error("DYNAMIC API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
