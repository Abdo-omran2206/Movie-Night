import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { fetchStatusCount, fetchNewBookmarks } from "@/lib/services/BookmarkDb";

export async function GET() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;

    const status = await fetchStatusCount(user.id);
    const newBookmarks = await fetchNewBookmarks(user.id);

    return NextResponse.json({ user, status, newBookmarks });
  } catch (err) {
    console.error("/api/dashboard error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
