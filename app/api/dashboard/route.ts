import { NextResponse } from "next/server";
import { BookmarkData } from "@/constant/types";
import { createSupabaseServerClient } from "../lib/supabase";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await fetchStatusCount(supabase, user.id);
    const newBookmarks = await fetchNewBookmarks(supabase, user.id);

    return NextResponse.json({ status, newBookmarks });
  } catch (err) {
    console.error("/api/dashboard error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function fetchStatusCount(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("bookmark")
    .select("status")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return {};
  }

  const counts: Record<string, number> = {};

  data?.forEach((item: any) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });

  return counts;
}

async function fetchNewBookmarks(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("bookmark")
    .select(`
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
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching new bookmarks:", error);
    return [];
  }

  return (data as unknown as BookmarkData[]) || [];
}