import { createClient } from "@supabase/supabase-js";

/** Anonymous client for public routes (e.g. pay page) under RLS. */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
