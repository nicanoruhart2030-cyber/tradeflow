import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Server-only: service role (bypasses RLS). Use only after Clerk auth + filter by userId. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
