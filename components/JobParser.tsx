"use client";

import type { LineItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

export interface JobParserProps {
  customerName: string;
  customerPhone: string;
  jobAddress: string;
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
  onCustomerName: (v: string) => void;
  onCustomerPhone: (v: string) => void;
  onJobAddress: (v: string) => void;
  onNotes: (v: string) => void;
  onTaxRate: (v: number) => void;
  onLineItemsChange: (items: LineItem[]) => void;
}

export function JobParser({
  customerName,
  customerPhone,
  jobAddress,
  lineItems,
  notes,
  taxRate,
  onCustomerName,
  onCustomerPhone,
  onJobAddress,
  onNotes,
  onTaxRate,
  onLineItemsChange,
}: JobParserProps) {
  const updateLine = (id: string, field: keyof LineItem, value: string | number) => {
    const next = lineItems.map((row) => {
      if (row.id !== id) return row;
      const updated = { ...row, [field]: value };
      if (field === "quantity" || field === "unit_price") {
        const q = Number(updated.quantity) || 0;
        const p = Number(updated.unit_price) || 0;
        updated.amount = parseFloat((q * p).toFixed(2));
      }
      return updated;
    });
    onLineItemsChange(next);
  };

  const addRow = () => {
    onLineItemsChange([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit_price: 0,
        amount: 0,
      },
    ]);
  };

  const removeRow = (id: string) => {
    onLineItemsChange(lineItems.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Customer name
          </label>
          <input
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors min-h-[44px]"
            value={customerName}
            onChange={(e) => onCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Customer phone
          </label>
          <input
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors min-h-[44px] font-mono"
            value={customerPhone}
            onChange={(e) => onCustomerPhone(e.target.value)}
            placeholder="5551234567"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Job address
          </label>
          <input
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors min-h-[44px]"
            value={jobAddress}
            onChange={(e) => onJobAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Tax rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[var(--accent)] transition-colors min-h-[44px]"
            value={taxRate}
            onChange={(e) => onTaxRate(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Line items
          </span>
          <button
            type="button"
            onClick={addRow}
            className="text-sm text-[var(--accent)] border border-[var(--border)] rounded-lg px-3 py-2 min-h-[44px] hover:border-[var(--border-bright)] hover:bg-[var(--accent-dim)] transition-all"
          >
            Add row
          </button>
        </div>
        <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)] text-xs uppercase">
                <th className="p-2 font-medium">Description</th>
                <th className="p-2 font-medium w-20">Qty</th>
                <th className="p-2 font-medium w-28">Unit</th>
                <th className="p-2 font-medium w-28">Amount</th>
                <th className="p-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {lineItems.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-2">
                    <input
                      className="w-full bg-transparent border border-transparent focus:border-[var(--accent)] rounded px-2 py-1.5 text-[var(--text-primary)] focus:outline-none min-h-[40px]"
                      value={row.description}
                      onChange={(e) => updateLine(row.id, "description", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full bg-transparent border border-transparent focus:border-[var(--accent)] rounded px-2 py-1.5 font-mono min-h-[40px]"
                      value={row.quantity}
                      onChange={(e) =>
                        updateLine(row.id, "quantity", parseFloat(e.target.value) || 0)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-transparent border border-transparent focus:border-[var(--accent)] rounded px-2 py-1.5 font-mono min-h-[40px]"
                      value={row.unit_price}
                      onChange={(e) =>
                        updateLine(row.id, "unit_price", parseFloat(e.target.value) || 0)
                      }
                    />
                  </td>
                  <td className="p-2 font-mono text-[var(--text-primary)]">
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="text-[var(--danger)] text-xs px-2 py-1 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-elevated)] min-h-[40px] min-w-[40px]"
                      aria-label="Remove line"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
          Notes
        </label>
        <textarea
          rows={3}
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
        />
      </div>
    </div>
  );
}
