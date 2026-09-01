import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { error: "Playlist token is required" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Get user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: playlist, error } = await supabase
      .from("playlists")
      .select(`
        id,
        user_id,
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
      .eq("share_token", token)
      .single();

    if (error || !playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check visibility logic (Private playlists are restricted to the owner even with share token)
    if (playlist.visibility === "private") {
      if (!user || playlist.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(playlist);
  } catch (err: any) {
    console.error("GET playlist by token error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
