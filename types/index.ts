export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  customer_id?: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  job_description: string;
  job_address: string;
  line_items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: InvoiceStatus;
  stripe_payment_link?: string;
  stripe_payment_intent_id?: string;
  due_date?: string;
  paid_at?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  job_count: number;
  total_revenue: number;
  created_at: string;
}

export interface Profile {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  tax_rate: number;
  stripe_account_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ParsedJob {
  customer_name: string;
  customer_phone: string;
  job_address: string;
  line_items: Omit<LineItem, "id">[];
  notes: string;
  confidence: number;
}

export interface DashboardStats {
  total_revenue: number;
  outstanding: number;
  paid_this_month: number;
  invoice_count: number;
  paid_count: number;
  pending_count: number;
}
