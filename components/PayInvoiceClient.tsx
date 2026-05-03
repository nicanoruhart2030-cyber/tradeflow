"use client";

import Link from "next/link";
import { Zap, Check } from "lucide-react";
import type { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PayInvoiceClientProps {
  invoice: Invoice;
  businessName: string;
  showPaidBanner: boolean;
}

export function PayInvoiceClient({
  invoice,
  businessName,
  showPaidBanner,
}: PayInvoiceClientProps) {
  const paid = invoice.status === "paid" || showPaidBanner;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-[#080810]" strokeWidth={2.5} />
          </div>
          <span className="font-syne font-extrabold text-sm text-[var(--text-primary)]">
            TradeFlow
          </span>
        </div>

        <div className="bg-[#f4f4f8] border border-[var(--border)] rounded-lg p-6 text-[#080810]">
          <p className="text-xs text-[#8888A0] uppercase tracking-wider mb-1">{businessName}</p>
          <h1 className="font-syne font-extrabold text-2xl mb-1">Invoice</h1>
          <p className="text-sm text-[#44445A] mb-6">
            {invoice.customer_name} · {invoice.invoice_number} · {formatDate(invoice.created_at)}
          </p>

          <div className="border border-[#1E1E2E] rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#e8e8ee] text-left text-xs uppercase text-[#8888A0]">
                  <th className="p-2">Item</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((row) => (
                  <tr key={row.id} className="border-t border-[#1E1E2E]">
                    <td className="p-2">{row.description}</td>
                    <td className="p-2 text-right font-mono">{formatCurrency(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-baseline mb-8">
            <span className="text-sm font-medium">Total due</span>
            <span className="font-mono text-3xl font-medium text-[#080810]">
              {formatCurrency(invoice.total)}
            </span>
          </div>

          {paid ? (
            <div className="flex items-center gap-2 text-[#080810] bg-[rgba(0,229,160,0.2)] border border-[rgba(0,229,160,0.35)] rounded-lg px-4 py-3 text-sm font-medium">
              <Check size={18} className="text-[#00a67a]" strokeWidth={2.5} />
              Payment received — thank you.
            </div>
          ) : invoice.stripe_payment_link ? (
            <a
              href={invoice.stripe_payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#00E5A0] text-[#080810] font-medium text-sm px-4 py-3 rounded-lg hover:bg-[#00CCB0] min-h-[48px] leading-[48px]"
            >
              Pay {formatCurrency(invoice.total)} securely
            </a>
          ) : (
            <p className="text-sm text-[#8888A0]">Payment link not available.</p>
          )}

          <p className="text-center text-[10px] text-[#8888A0] mt-8">Secured by Stripe</p>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          <Link href="/" className="hover:text-[var(--text-secondary)]">
            tradeflow.app
          </Link>
        </p>
      </div>
    </div>
  );
}
