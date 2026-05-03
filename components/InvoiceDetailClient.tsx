"use client";

import { useState } from "react";
import Link from "next/link";
import type { Invoice } from "@/types";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatCurrency, formatDate, isInvoiceOverdue } from "@/lib/utils";
import { normalizeInvoice } from "@/lib/invoice-normalize";
import { Check } from "lucide-react";

interface InvoiceDetailClientProps {
  invoice: Invoice;
}

export function InvoiceDetailClient({ invoice: initial }: InvoiceDetailClientProps) {
  const [invoice, setInvoice] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const displayStatus = isInvoiceOverdue(invoice) ? "overdue" : invoice.status;

  const refresh = async () => {
    const res = await fetch(`/api/invoices/${invoice.id}`);
    if (res.ok) {
      const raw = (await res.json()) as Record<string, unknown>;
      setInvoice(normalizeInvoice(raw));
    }
  };

  const send = async () => {
    setLoading("send");
    setMsg(null);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setMsg("Invoice sent.");
      await refresh();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(null);
    }
  };

  const markPaid = async () => {
    setLoading("paid");
    setMsg(null);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paid_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      await refresh();
      setMsg("Marked as paid.");
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(null);
    }
  };

  const copyLink = async () => {
    if (!invoice.stripe_payment_link) return;
    await navigator.clipboard.writeText(invoice.stripe_payment_link);
    setMsg("Payment link copied.");
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h1 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
              {invoice.invoice_number}
            </h1>
            <StatusTag status={displayStatus} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">{formatDate(invoice.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {invoice.status === "draft" ? (
            <button
              type="button"
              onClick={send}
              disabled={!!loading}
              className="bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg min-h-[44px] disabled:opacity-50"
            >
              {loading === "send" ? "Sending…" : "Send invoice"}
            </button>
          ) : null}
          {(invoice.status === "sent" || displayStatus === "overdue") && (
            <button
              type="button"
              onClick={send}
              disabled={!!loading}
              className="border border-[var(--border)] text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-[var(--accent-dim)]"
            >
              Resend
            </button>
          )}
          {invoice.status === "sent" || displayStatus === "overdue" ? (
            <button
              type="button"
              onClick={markPaid}
              disabled={!!loading}
              className="border border-[var(--border)] text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-[var(--bg-elevated)]"
            >
              {loading === "paid" ? "Saving…" : "Mark as paid"}
            </button>
          ) : null}
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            className="inline-flex items-center justify-center border border-[var(--border)] text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-[var(--bg-elevated)]"
          >
            Download PDF
          </a>
          {invoice.stripe_payment_link ? (
            <button
              type="button"
              onClick={copyLink}
              className="border border-[var(--border)] text-sm px-4 py-2.5 rounded-lg min-h-[44px] hover:bg-[var(--bg-elevated)]"
            >
              Copy payment link
            </button>
          ) : null}
        </div>
      </div>

      {msg ? (
        <p className="text-sm text-[var(--accent)] border border-[var(--border)] rounded-lg px-3 py-2">
          {msg}
        </p>
      ) : null}

      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5 space-y-2">
        <h2 className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Customer</h2>
        <p className="font-medium text-[var(--text-primary)]">{invoice.customer_name}</p>
        {invoice.customer_phone ? (
          <p className="font-mono text-sm text-[var(--text-secondary)]">{invoice.customer_phone}</p>
        ) : null}
        {invoice.customer_address ? (
          <p className="text-sm text-[var(--text-muted)]">{invoice.customer_address}</p>
        ) : null}
        {invoice.job_address ? (
          <p className="text-sm text-[var(--text-secondary)] mt-2">Job: {invoice.job_address}</p>
        ) : null}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)] text-xs uppercase">
              <th className="p-3">Description</th>
              <th className="p-3 w-16">Qty</th>
              <th className="p-3 w-24 text-right">Unit</th>
              <th className="p-3 w-24 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((row) => (
              <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                <td className="p-3 text-[var(--text-primary)]">{row.description}</td>
                <td className="p-3 font-mono">{row.quantity}</td>
                <td className="p-3 text-right font-mono">{formatCurrency(row.unit_price)}</td>
                <td className="p-3 text-right font-mono">{formatCurrency(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm border border-[var(--border)] rounded-lg p-4 bg-[var(--bg-surface)]">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Subtotal</span>
            <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">HST ({invoice.tax_rate}%)</span>
            <span className="font-mono">{formatCurrency(invoice.tax_amount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[var(--border)] font-medium">
            <span>Total</span>
            <span className="font-mono text-[var(--accent)]">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {invoice.status === "paid" ? (
        <div className="flex items-center gap-2 text-[var(--accent)] text-sm border border-[rgba(0,229,160,0.2)] rounded-lg px-3 py-2 bg-[var(--accent-dim)]">
          <Check size={16} strokeWidth={2.5} />
          Payment received — thank you.
        </div>
      ) : null}

      <Link
        href="/invoices"
        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        ← Back to invoices
      </Link>
    </div>
  );
}
