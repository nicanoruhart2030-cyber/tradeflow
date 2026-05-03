import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeInvoice } from "@/lib/invoice-normalize";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  let query = supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const normalized = (data || []).map((row) =>
    normalizeInvoice(row as Record<string, unknown>)
  );
  return NextResponse.json(normalized);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data: numberData, error: rpcError } = await supabase.rpc(
    "generate_invoice_number",
    { p_user_id: user.id }
  );

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  const invoiceData = {
    customer_name: body.customer_name,
    customer_phone: body.customer_phone ?? "",
    customer_email: body.customer_email ?? "",
    customer_address: body.customer_address ?? "",
    job_description: body.job_description ?? "",
    job_address: body.job_address ?? "",
    line_items: body.line_items ?? [],
    subtotal: body.subtotal ?? 0,
    tax_rate: body.tax_rate ?? 13,
    tax_amount: body.tax_amount ?? 0,
    total: body.total ?? 0,
    notes: body.notes ?? "",
    due_date:
      body.due_date ||
      new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    user_id: user.id,
    invoice_number: numberData as string,
    status: "draft",
  };

  const { data, error } = await supabase
    .from("invoices")
    .insert(invoiceData)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(normalizeInvoice(data as Record<string, unknown>), { status: 201 });
}
