import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/DashboardStats";
import { InvoiceCard } from "@/components/InvoiceCard";
import type { Invoice, DashboardStats as Stats } from "@/types";
import { Mic, Plus } from "lucide-react";
import { normalizeInvoice } from "@/lib/invoice-normalize";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: invoicesRaw, error: invError } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const invoices: Invoice[] = (invoicesRaw || []).map((row) =>
    normalizeInvoice(row as Record<string, unknown>)
  );

  const paid = invoices.filter((i) => i.status === "paid");
  const sent = invoices.filter((i) => i.status === "sent");

  const total_revenue = paid.reduce((s, i) => s + Number(i.total), 0);
  const outstanding = sent.reduce((s, i) => s + Number(i.total), 0);

  const monthStart = startOfMonth(new Date());
  const paid_this_month = paid
    .filter((i) => i.paid_at && new Date(i.paid_at) >= monthStart)
    .reduce((s, i) => s + Number(i.total), 0);

  const stats: Stats = {
    total_revenue,
    outstanding,
    paid_this_month,
    invoice_count: invoices.length,
    paid_count: paid.length,
    pending_count: invoices.filter((i) => i.status === "draft" || i.status === "sent").length,
  };

  const recent = invoices.slice(0, 5);

  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = profile?.business_name?.trim() || "there";

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      {invError ? (
        <div
          className="border border-[var(--warning)] rounded-lg px-4 py-3 text-sm text-[var(--warning)] bg-[rgba(245,166,35,0.08)]"
          role="alert"
        >
          Invoices could not be loaded ({invError.message}). Confirm the Supabase SQL from the
          setup guide ran successfully and environment variables are set on Vercel.
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
            {greet}, {name}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Here is how your business is doing.
          </p>
        </div>
        <Link
          href="/new"
          className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[#080810] font-medium text-sm px-5 py-3 rounded-lg hover:bg-[#00CCB0] transition-colors min-h-[44px] border border-transparent"
        >
          <Plus size={18} strokeWidth={2} />
          New Invoice
        </Link>
      </div>

      <DashboardStats stats={stats} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne font-extrabold text-lg text-[var(--text-primary)]">
            Recent invoices
          </h2>
          <Link
            href="/invoices"
            className="text-sm text-[var(--accent)] hover:underline min-h-[44px] inline-flex items-center"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-10 text-center">
            <Mic className="mx-auto mb-4 text-[var(--text-muted)]" size={40} strokeWidth={1.25} />
            <p className="text-[var(--text-secondary)] mb-4">
              Create your first invoice — just speak the job
            </p>
            <Link
              href="/new"
              className="inline-flex items-center justify-center bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#00CCB0] min-h-[44px]"
            >
              New invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
