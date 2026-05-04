import "server-only";

import { getClerkUserId } from "@/lib/clerk-user";
import { createAdminClient } from "./admin";

export type AuthedSupabaseContext = {
  supabase: ReturnType<typeof createAdminClient>;
  userId: string;
};

/** Clerk-authenticated Supabase (service role + caller userId). Never trust client-supplied ids. */
export async function getSupabaseWithUser(): Promise<AuthedSupabaseContext | null> {
  const userId = await getClerkUserId();
  if (!userId) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  return { supabase: createAdminClient(), userId };
}
