"use client";

import { useEffect, useMemo, useState } from "react";
import { InvoiceCard } from "@/components/InvoiceCard";
import type { Invoice, InvoiceStatus } from "@/types";
import { isInvoiceOverdue } from "@/lib/utils";

type Filter = "all" | InvoiceStatus | "overdue";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (!cancelled && res.ok) setInvoices(data as Invoice[]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "sent", label: "Sent" },
    { id: "paid", label: "Paid" },
    { id: "overdue", label: "Overdue" },
    { id: "draft", label: "Draft" },
  ];

  const filtered = useMemo(() => {
    let list = invoices;
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((i) => i.customer_name.toLowerCase().includes(q));

    if (filter === "all") return list;
    if (filter === "overdue") {
      return list.filter((i) => isInvoiceOverdue(i));
    }
    return list.filter((i) => i.status === filter);
  }, [invoices, filter, search]);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
          Invoices
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Search and filter your work.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`px-3 py-2 rounded-lg text-sm border min-h-[40px] transition-all ${
                filter === t.id
                  ? "bg-[var(--accent-dim)] border-[rgba(0,229,160,0.2)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-bright)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search customer…"
          className="w-full sm:max-w-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-8 text-center text-[var(--text-secondary)] text-sm">
          No invoices match this view.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inv) => (
            <InvoiceCard key={inv.id} invoice={inv} />
          ))}
        </div>
      )}
    </div>
  );
}
