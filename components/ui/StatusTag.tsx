import { STATUS_COLORS } from "@/lib/utils";
import type { InvoiceStatus } from "@/types";

const LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export function StatusTag({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border font-mono ${STATUS_COLORS[status]}`}
    >
      {status === "paid" ? (
        <span className="w-1.5 h-1.5 rounded-sm bg-[var(--accent)] mr-1.5 shrink-0" aria-hidden />
      ) : null}
      {LABELS[status]}
    </span>
  );
}
