import { supabaseClient } from "@/lib/supabase";

export async function getUserSession() {
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      return { success: false, userId: null };
    }

    return {
      success: true,
      userId: session.user.id,
    };
  } catch (err) {
    console.error("Session error:", err);
    return { success: false, userId: null };
  }
}