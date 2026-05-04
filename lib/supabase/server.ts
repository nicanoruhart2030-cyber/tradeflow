import "server-only";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "./admin";

export type AuthedSupabaseContext = {
  supabase: ReturnType<typeof createAdminClient>;
  userId: string;
};

/** Clerk-authenticated Supabase (service role + caller userId). Never trust client-supplied ids. */
export async function getSupabaseWithUser(): Promise<AuthedSupabaseContext | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return { supabase: createAdminClient(), userId };
}
