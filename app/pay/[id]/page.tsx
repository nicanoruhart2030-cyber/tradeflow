import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/admin";
import { PayInvoiceClient } from "@/components/PayInvoiceClient";
import type { Invoice, Profile } from "@/types";

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

  const inv = invoice as unknown as Invoice;
  if (inv.status !== "sent" && inv.status !== "paid") notFound();

  const { data: profile } = await admin
    .from("profiles")
    .select("business_name")
    .eq("id", inv.user_id)
    .single();

  const businessName = (profile as Pick<Profile, "business_name"> | null)?.business_name || "TradeFlow";

  return (
    <PayInvoiceClient
      invoice={inv}
      businessName={businessName}
      showPaidBanner={searchParams.paid === "true" || inv.status === "paid"}
    />
  );
}
