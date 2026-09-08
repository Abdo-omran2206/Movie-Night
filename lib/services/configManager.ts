import { supabaseClient } from "../supabase";

export default async function AppConfig() {
  try {
    const { data } = await supabaseClient
      .from("app_config")
      .select("force_stop,force_message,platform")
      .maybeSingle();

    if (
      data?.force_stop &&
      (data?.platform === "website" || data?.platform === "all")
    ) {
      if (data.force_message) {
        return data.force_message;
      }
    }
  } catch (error) {
    console.error("Error checking maintenance status in layout:", error);
  }
}
