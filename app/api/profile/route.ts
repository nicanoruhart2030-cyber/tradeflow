import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureProfileForUser } from "@/lib/ensure-profile";
import type { Profile } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  await ensureProfileForUser(supabase, userId, email);

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Profile not found" }, { status: 500 });
  }
  return NextResponse.json(data as unknown as Profile);
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<
    Pick<
      Profile,
      | "business_name"
      | "owner_name"
      | "phone"
      | "email"
      | "address"
      | "city"
      | "province"
      | "postal_code"
      | "tax_rate"
    >
  >;

  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").update(body).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
