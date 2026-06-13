import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function POST() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return NextResponse.json({ error: error.message || "Sign out failed" }, { status: 500 });
    }
    return NextResponse.json({ message: "Signed out" });
  } catch (err) {
    console.error("/api/account/logout error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
