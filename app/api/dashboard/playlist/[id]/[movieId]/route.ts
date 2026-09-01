import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/lib/supabase";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; movieId: string }> },
) {
  const { id, movieId } = await params;

  if (!id || !movieId) {
    return NextResponse.json(
      { error: "Playlist ID and Movie ID are required" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 🔐 Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔐 Verify playlist ownership
    const { data: playlist, error: fetchError } = await supabase
      .from("playlists")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 },
      );
    }

    if (playlist.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete relation from playlist_items
    const { error: deleteError } = await supabase
      .from("playlist_items")
      .delete()
      .eq("playlist_id", id)
      .eq("movie_id", Number(movieId));

    if (deleteError) {
      console.error("Error removing movie from playlist:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Movie removed from playlist successfully",
    });
  } catch (err: any) {
    console.error("DELETE movie from playlist error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; movieId: string }> },
) {
  const { id, movieId } = await params;

  if (!id || !movieId) {
    return NextResponse.json(
      { error: "Playlist ID and Movie ID are required" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 🔐 Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔎 check if movie exists in user's playlist
    const { data, error } = await supabase
      .from("playlist_items")
      .select(
        `
        id,
        playlists!inner(user_id)
      `,
      )
      .eq("playlist_id", id)
      .eq("movie_id", movieId)
      .eq("playlists.user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    // ✅ exists or not
    return NextResponse.json({
      exists: !!data,
      item: data ?? null,
    });

  } catch (err: any) {
    console.error("GET movie in playlist error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}