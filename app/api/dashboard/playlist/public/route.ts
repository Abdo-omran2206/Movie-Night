import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/lib/supabase";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("playlists")
      .select(`
        id,
        name,
        description,
        visibility,
        slug,
        share_token,
        created_at,
        updated_at,
        playlist_items (
          movie_id,
          movies (
            movie_id,
            title,
            overview,
            poster_path,
            backdrop_path,
            type
          )
        )
      `)
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching public playlists:", error);
      return NextResponse.json(
        { error: "Failed to fetch public playlists" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET public playlists error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
