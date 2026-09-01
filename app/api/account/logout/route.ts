import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/account/logout error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
