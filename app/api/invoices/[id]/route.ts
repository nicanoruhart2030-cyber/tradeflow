import { NextRequest, NextResponse } from "next/server";
import { getSupabaseWithUser } from "@/lib/supabase/server";
import { normalizeInvoice } from "@/lib/invoice-normalize";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await getSupabaseWithUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await ctx.supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", ctx.userId)
    .single();

  if (error) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json(normalizeInvoice(data as Record<string, unknown>));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await getSupabaseWithUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await ctx.supabase
    .from("invoices")
    .update(body)
    .eq("id", params.id)
    .eq("user_id", ctx.userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(normalizeInvoice(data as Record<string, unknown>));
}
