import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    // Prefer authenticated session
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    const { searchParams } = new URL(req.url);
    const fallbackUserId = searchParams.get("userId");

    const userId = session?.user?.id || fallbackUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching watchlist:", error);
      return NextResponse.json({ error: error.message || "Failed to fetch" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("/api/account/watchlist error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
