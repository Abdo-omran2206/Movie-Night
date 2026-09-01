import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Playlist slug is required" },
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
      .eq("slug", slug)
      .single();

    if (error || !playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check visibility logic
    if (playlist.visibility === "private") {
      if (!user || playlist.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(playlist);
  } catch (err: any) {
    console.error("GET playlist by slug error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
