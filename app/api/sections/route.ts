import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseClient
    .from("sections_content")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
