import Link from "next/link";
import type { Invoice } from "@/types";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatCurrency, formatDate, isInvoiceOverdue } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const displayStatus = isInvoiceOverdue(invoice) ? "overdue" : invoice.status;

  return (
    <Link href={`/invoice/${invoice.id}`}>
      <div
        className="
        bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-4
        hover:border-[var(--border-bright)] hover:bg-[var(--bg-elevated)]
        transition-all group cursor-pointer
      "
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {invoice.customer_name}
                </span>
                <StatusTag status={displayStatus} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {invoice.invoice_number}
                </span>
                <span className="text-[var(--text-muted)] text-xs">·</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatDate(invoice.created_at)}
                </span>
                {invoice.job_address ? (
                  <>
                    <span className="text-[var(--text-muted)] text-xs">·</span>
                    <span className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">
                      {invoice.job_address}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-sm font-medium text-[var(--text-primary)]">
              {formatCurrency(invoice.total)}
            </span>
            <ChevronRight
              size={14}
              className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
