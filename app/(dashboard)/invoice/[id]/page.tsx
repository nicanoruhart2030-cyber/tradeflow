import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvoiceDetailClient } from "@/components/InvoiceDetailClient";
import { normalizeInvoice } from "@/lib/invoice-normalize";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  const invoice = normalizeInvoice(data as Record<string, unknown>);

  return <InvoiceDetailClient invoice={invoice} />;
}
