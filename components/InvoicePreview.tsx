import type { LineItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface InvoicePreviewProps {
  customerName: string;
  customerPhone: string;
  jobAddress: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
}

export function InvoicePreview({
  customerName,
  customerPhone,
  jobAddress,
  lineItems,
  subtotal,
  taxRate,
  taxAmount,
  total,
  notes,
}: InvoicePreviewProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5 space-y-4 fade-up">
      <h3 className="font-syne font-extrabold text-[var(--text-primary)] text-base">Preview</h3>
      <div className="text-sm space-y-1">
        <p className="text-[var(--text-secondary)]">Customer</p>
        <p className="text-[var(--text-primary)] font-medium">{customerName}</p>
        {customerPhone ? (
          <p className="font-mono text-xs text-[var(--text-muted)]">{customerPhone}</p>
        ) : null}
        {jobAddress ? (
          <p className="text-xs text-[var(--text-muted)] mt-2">{jobAddress}</p>
        ) : null}
      </div>
      <div className="border-t border-[var(--border)] pt-4 space-y-2">
        {lineItems.map((item) => (
          <div key={item.id} className="flex justify-between gap-2 text-sm">
            <span className="text-[var(--text-secondary)] truncate">{item.description}</span>
            <span className="font-mono text-[var(--text-primary)] shrink-0">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Subtotal</span>
          <span className="font-mono">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">HST ({taxRate}%)</span>
          <span className="font-mono">{formatCurrency(taxAmount)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[var(--border)]">
          <span className="font-medium text-[var(--text-primary)]">Total</span>
          <span className="font-mono text-lg text-[var(--accent)]">{formatCurrency(total)}</span>
        </div>
      </div>
      {notes ? (
        <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-3">
          {notes}
        </p>
      ) : null}
    </div>
  );
}
