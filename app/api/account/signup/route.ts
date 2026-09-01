import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const body = await req.json();
    const { step = 1, email, password, username, verificationCode } = body;

    if (Number(step) === 1) {
      if (!email || !password || !username) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, full_name: username } },
      });

      if (error) {
        return NextResponse.json(
          { error: error.message || "Signup failed" },
          { status: 400 },
        );
      }

      return NextResponse.json({ message: "Signup initiated", data });
    }

    // Step 2: verify code
    if (Number(step) === 2) {
      if (!email || !verificationCode) {
        return NextResponse.json(
          { error: "Missing verification data" },
          { status: 400 },
        );
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: "signup",
      });

      if (error) {
        return NextResponse.json(
          { error: error.message || "Verification failed" },
          { status: 400 },
        );
      }

      return NextResponse.json({ message: "Verified", data });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch (err) {
    console.error("/api/account/signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
