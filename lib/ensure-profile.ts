import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type EnsureProfileResult =
  | { ok: true }
  | { ok: false; error: string };

/** Insert a profiles row for new Clerk users (replaces Supabase Auth trigger). */
export async function ensureProfileForUser(
  supabase: SupabaseClient,
  userId: string,
  email: string
): Promise<EnsureProfileResult> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return { ok: true };

  const { error } = await supabase.from("profiles").insert({
    id: userId,
    email,
    business_name: "",
    owner_name: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    tax_rate: 13,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
