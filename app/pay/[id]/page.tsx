import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { PayInvoiceClient } from "@/components/PayInvoiceClient";
import type { Invoice, Profile } from "@/types";
import { normalizeInvoice } from "@/lib/invoice-normalize";

export const dynamic = "force-dynamic";

export default async function PayPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { paid?: string };
}) {
  const admin = createAdminClient();

  const { data: invoice, error } = await admin
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !invoice) notFound();

  const inv = normalizeInvoice(invoice as Record<string, unknown>);
  if (inv.status !== "sent" && inv.status !== "paid") notFound();

  const { data: profile } = await admin
    .from("profiles")
    .select("business_name")
    .eq("id", inv.user_id)
    .maybeSingle();

  const businessName =
    (profile as Pick<Profile, "business_name"> | null)?.business_name || "TradeFlow";

  return (
    <PayInvoiceClient
      invoice={inv as Invoice}
      businessName={businessName}
      showPaidBanner={searchParams.paid === "true" || inv.status === "paid"}
    />
  );
}
