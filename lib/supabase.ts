import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // 👈 ده أهم حاجة
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
