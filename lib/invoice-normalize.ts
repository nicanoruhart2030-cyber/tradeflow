import { v4 as uuidv4 } from "uuid";
import type { Invoice, LineItem } from "@/types";

export function parseLineItems(raw: unknown): LineItem[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((row: Record<string, unknown>) => ({
      id: typeof row.id === "string" ? row.id : uuidv4(),
      description: String(row.description ?? ""),
      quantity: Number(row.quantity) || 0,
      unit_price: Number(row.unit_price) || 0,
      amount: Number(row.amount) || 0,
    }));
  }
  if (typeof raw === "string") {
    try {
      return parseLineItems(JSON.parse(raw) as unknown);
    } catch {
      return [];
    }
  }
  return [];
}

export function normalizeInvoice(row: Record<string, unknown>): Invoice {
  const inv = row as unknown as Invoice;
  return {
    ...inv,
    line_items: parseLineItems(row.line_items),
    subtotal: Number(row.subtotal) || 0,
    tax_rate: Number(row.tax_rate) || 0,
    tax_amount: Number(row.tax_amount) || 0,
    total: Number(row.total) || 0,
  };
}
