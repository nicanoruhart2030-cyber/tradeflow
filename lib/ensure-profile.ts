import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/** Insert a profiles row for new Clerk users (replaces Supabase Auth trigger). */
export async function ensureProfileForUser(
  supabase: SupabaseClient,
  userId: string,
  email: string
): Promise<void> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

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
    throw new Error(`Could not create profile: ${error.message}`);
  }
}
