import { notFound, redirect } from "next/navigation";
import { getSupabaseWithUser } from "@/lib/supabase/server";
import { InvoiceDetailClient } from "@/components/InvoiceDetailClient";
import { normalizeInvoice } from "@/lib/invoice-normalize";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getSupabaseWithUser();
  if (!ctx) redirect("/login");

  const { data, error } = await ctx.supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", ctx.userId)
    .single();

  if (error || !data) notFound();

  const invoice = normalizeInvoice(data as Record<string, unknown>);

  return <InvoiceDetailClient invoice={invoice} />;
}
