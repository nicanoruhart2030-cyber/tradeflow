import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentLink } from "@/lib/stripe";
import { sendInvoiceSMS } from "@/lib/twilio";
import { formatCurrency } from "@/lib/utils";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  try {
    const paymentLink = await createPaymentLink(
      invoice.id,
      Math.round(Number(invoice.total) * 100),
      invoice.customer_name,
      invoice.invoice_number,
      appUrl
    );

    await supabase
      .from("invoices")
      .update({ stripe_payment_link: paymentLink, status: "sent" })
      .eq("id", params.id);

    if (invoice.customer_phone) {
      await sendInvoiceSMS(
        invoice.customer_phone,
        profile?.business_name || "Your contractor",
        invoice.invoice_number,
        formatCurrency(Number(invoice.total)),
        paymentLink
      );
    }

    return NextResponse.json({ payment_link: paymentLink, status: "sent" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Send failed";
    console.error("Send error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
