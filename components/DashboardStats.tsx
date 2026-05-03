import type { DashboardStats as Stats } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function DashboardStats({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total Revenue", value: formatCurrency(stats.total_revenue), mono: true },
    {
      label: "Outstanding",
      value: formatCurrency(stats.outstanding),
      mono: true,
      warn: stats.outstanding > 0,
    },
    {
      label: "Paid This Month",
      value: formatCurrency(stats.paid_this_month),
      mono: true,
      accent: true,
    },
    { label: "Invoices", value: `${stats.paid_count}/${stats.invoice_count} paid`, mono: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-4"
        >
          <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">
            {item.label}
          </p>
          <p
            className={`text-xl font-medium
            ${item.mono ? "font-mono" : ""}
            ${item.accent ? "text-[var(--accent)]" : ""}
            ${item.warn ? "text-[var(--warning)]" : ""}
            ${!item.accent && !item.warn ? "text-[var(--text-primary)]" : ""}
          `}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
