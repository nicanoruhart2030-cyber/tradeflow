export function formatCurrency(amount: number, currency = "CAD"): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function calculateTotals(
  lineItems: { amount: number }[],
  taxRate: number
): { subtotal: number; tax_amount: number; total: number } {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax_amount = parseFloat((subtotal * (taxRate / 100)).toFixed(2));
  const total = parseFloat((subtotal + tax_amount).toFixed(2));
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax_amount,
    total,
  };
}

export function getDueDateFromNow(days = 14): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0]!;
}

export const STATUS_COLORS: Record<string, string> = {
  draft:
    "text-[var(--text-muted)] bg-[var(--bg-elevated)] border-[var(--border)]",
  sent: "text-[var(--warning)] bg-[rgba(245,166,35,0.1)] border-[rgba(245,166,35,0.2)]",
  paid: "text-[var(--accent)] bg-[var(--accent-dim)] border-[rgba(0,229,160,0.2)]",
  overdue:
    "text-[var(--danger)] bg-[rgba(255,75,75,0.1)] border-[rgba(255,75,75,0.2)]",
  cancelled:
    "text-[var(--text-muted)] bg-[var(--bg-elevated)] border-[var(--border)]",
};

/** True if invoice should be treated as overdue in UI (not necessarily DB status). */
export function isInvoiceOverdue(inv: {
  status: string;
  due_date?: string | null;
}): boolean {
  if (inv.status !== "sent" || !inv.due_date) return false;
  const due = new Date(inv.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
