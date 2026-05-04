import { NextRequest, NextResponse } from "next/server";
import { getSupabaseWithUser } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePDF";
import type { Profile } from "@/types";
import { normalizeInvoice } from "@/lib/invoice-normalize";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ctx = await getSupabaseWithUser();
  if (!ctx) return new NextResponse("Unauthorized", { status: 401 });

  const { data: invoice } = await ctx.supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", ctx.userId)
    .single();

  const { data: profile } = await ctx.supabase
    .from("profiles")
    .select("*")
    .eq("id", ctx.userId)
    .single();

  if (!invoice || !profile) return new NextResponse("Not found", { status: 404 });

  const inv = normalizeInvoice(invoice as Record<string, unknown>);
  const buffer = await renderToBuffer(
    <InvoicePDF invoice={inv} profile={profile as unknown as Profile} />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoice_number}.pdf"`,
    },
  });
}
