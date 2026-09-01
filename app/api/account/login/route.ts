import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Login failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: data.user });
  } catch (err) {
    console.error("/api/account/login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}