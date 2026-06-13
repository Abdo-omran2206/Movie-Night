import { supabaseClient } from "../supabase";

export async function fetchWatchServer(type: "movie" | "tv") {
  try {
    const column = type === "movie" ? "full_url" : "full_url_tv";

    const { data, error } = await supabaseClient
      .from("stream_urls")
      .select(`${column}, name`)
      .eq("is_active", true)
      .order("added_at", { ascending: true });

    if (error) {
      console.error("Error fetching watch servers:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
}