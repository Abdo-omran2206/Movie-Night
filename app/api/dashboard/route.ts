import { NextResponse } from "next/server";
// import { fetchStatusCount, fetchNewBookmarks } from "@/lib/services/BookmarkDb";
import { getUserSession } from "../lib/getUserSession";
import { supabaseClient } from "@/lib/supabase";
import { BookmarkData } from "@/constant/types";

export async function GET() {
  const { success, userId } = await getUserSession();

  if (!success || !userId) {
    return NextResponse.json(
      { error: "Unauthorized", message: userId },
      { status: 401 },
    );
  }
  try {
    const status = await fetchStatusCount(userId);
    const newBookmarks = await fetchNewBookmarks(userId);
    if (!status || !newBookmarks) {
      NextResponse.json({ sucsses: false }, { status: 401 });
    }
    return NextResponse.json({ status, newBookmarks });
  } catch (err) {
    console.error("/api/dashboard error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function fetchStatusCount(userId: string) {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return {};
  }

  const counts: Record<string, number> = {};

  data?.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });

  return counts;
}

export async function fetchNewBookmarks(userId: string) {
  const { data, error } = await supabaseClient
    .from("bookmark")
    .select(
      `
        status,
        created_at,
        movies (
          movie_id,
          title,
          overview,
          poster_path,
          backdrop_path,
          type
        )
      `,
    )
    .range(0, 4)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching new bookmarks:", error);
    return [];
  }

  // Cast safety structure
  const formattedData = (data as unknown as BookmarkData[]) || [];
  return formattedData;
}
