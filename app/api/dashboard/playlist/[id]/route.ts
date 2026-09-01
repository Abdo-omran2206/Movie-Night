import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/api/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const playlistId = id;

  if (!playlistId) {
    return NextResponse.json(
      { error: "playlist ID is required" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Get user (could be guest for public/unlisted playlists)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: playlist, error } = await supabase
      .from("playlists")
      .select(
        `
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
      `,
      )
      .eq("id", playlistId)
      .single();

    if (error || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 },
      );
    }

    // Check visibility logic
    if (playlist.visibility === "private") {
      if (!user || playlist.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json(playlist);
  } catch (err: any) {
    console.error("GET playlist error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const playlistId = id;

  if (!playlistId) {
    return NextResponse.json(
      { error: "playlist ID is required" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 🔐 Auth (single source of truth)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔐 Verify playlist ownership
    const { data: playlist, error: verifyError } = await supabase
      .from("playlists")
      .select("user_id")
      .eq("id", playlistId)
      .single();

    if (verifyError || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 },
      );
    }

    if (playlist.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { movieID, title, overview, backdrop, poster, type } = body;

    if (!movieID || !title || !overview || !backdrop || !poster || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1️⃣ Upsert movie
    const { error: movieError } = await supabase.from("movies").upsert({
      movie_id: movieID,
      title,
      overview,
      poster_path: poster,
      backdrop_path: backdrop,
      type,
    });

    if (movieError) {
      console.error(movieError);
      return NextResponse.json({ error: movieError.message }, { status: 500 });
    }

    // 2️⃣ Add to playlist
    const { data: playlistItem, error: playlistError } = await supabase
      .from("playlist_items")
      .upsert(
        {
          playlist_id: playlistId,
          movie_id: movieID,
        },
        {
          onConflict: "playlist_id,movie_id",
        },
      )
      .select()
      .single();

    if (playlistError) {
      return NextResponse.json(
        { error: playlistError.message },
        { status: 500 },
      );
    }

    // 3️⃣ Response
    return NextResponse.json({
      success: true,
      data: playlistItem,
    });
  } catch (err: any) {
    console.error("playlist POST error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const playlistId = id;

  if (!playlistId) {
    return NextResponse.json(
      { error: "playlist ID is required" },
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

    // 🔐 Verify ownership
    const { data: playlist, error: fetchError } = await supabase
      .from("playlists")
      .select("user_id")
      .eq("id", playlistId)
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

    // 1️⃣ Delete items in the playlist
    const { error: itemsDeleteError } = await supabase
      .from("playlist_items")
      .delete()
      .eq("playlist_id", playlistId);

    if (itemsDeleteError) {
      console.error("Error deleting playlist items:", itemsDeleteError);
      return NextResponse.json(
        { error: itemsDeleteError.message },
        { status: 500 },
      );
    }

    // 2️⃣ Delete the playlist itself
    const { error: playlistDeleteError } = await supabase
      .from("playlists")
      .delete()
      .eq("id", playlistId);

    if (playlistDeleteError) {
      console.error("Error deleting playlist:", playlistDeleteError);
      return NextResponse.json(
        { error: playlistDeleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE playlist error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "playlist ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 🔐 auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📥 body
    const { visibility } = await req.json();

    // // ✅ validation
    // const allowed = ["public", "private", "unlisted"];
    // if (!allowed.includes(visibility)) {
    //   return NextResponse.json(
    //     { error: "Invalid visibility value" },
    //     { status: 400 }
    //   );
    // }

    // 🔐 تأكد إن ده صاحب الـ playlist
    const { data: playlist, error: fetchError } = await supabase
      .from("playlists")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    if (playlist.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ✏️ update
    const { error: visibilityError } = await supabase
      .from("playlists")
      .update({ visibility })
      .eq("id", id);

    if (visibilityError) {
      console.error(visibilityError);
      return NextResponse.json(
        { error: visibilityError.message },
        { status: 500 }
      );
    }

    // ✅ success
    return NextResponse.json({ success: true,status:200 });

  } catch (err) {
    console.error("PATCH /api/playlist/[id] error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}