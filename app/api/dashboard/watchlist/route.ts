import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { getUserSession } from "../../lib/getUserSession";

export async function GET() {
  try {
    const { success, userId } = await getUserSession();

    if (!success || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseClient
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching watchlist:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("/api/account/watchlist error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}