import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Invoice, Profile } from "@/types";

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: "Helvetica", backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  businessName: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#080810" },
  businessDetail: { fontSize: 9, color: "#8888A0", marginTop: 2 },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#080810",
    textAlign: "right",
  },
  invoiceNumber: { fontSize: 11, color: "#8888A0", textAlign: "right", marginTop: 4 },
  divider: { borderBottom: "1px solid #1E1E2E", marginVertical: 20 },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 9,
    color: "#8888A0",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionValue: { fontSize: 11, color: "#080810" },
  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #1E1E2E",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 9,
    color: "#8888A0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "1px solid #F0F0F8",
  },
  tableDesc: { flex: 3, fontSize: 10, color: "#080810" },
  tableQty: { flex: 1, fontSize: 10, color: "#080810", textAlign: "center" },
  tablePrice: { flex: 1, fontSize: 10, color: "#080810", textAlign: "right" },
  tableAmount: { flex: 1, fontSize: 10, color: "#080810", textAlign: "right", fontFamily: "Courier" },
  totalsSection: { alignItems: "flex-end", marginTop: 20 },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: { fontSize: 10, color: "#8888A0" },
  totalValue: { fontSize: 10, color: "#080810", fontFamily: "Courier" },
  grandTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "2px solid #080810",
  },
  grandTotalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#080810" },
  grandTotalValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#080810" },
  accentBar: { backgroundColor: "#00E5A0", height: 3, marginBottom: 48 },
  paymentNote: {
    marginTop: 40,
    padding: 12,
    backgroundColor: "#F8F8FF",
    borderLeft: "3px solid #00E5A0",
  },
  paymentText: { fontSize: 10, color: "#080810" },
  footer: { position: "absolute", bottom: 32, left: 48, right: 48 },
  footerText: { fontSize: 8, color: "#8888A0", textAlign: "center" },
});

interface InvoicePDFProps {
  invoice: Invoice;
  profile: Profile;
}

export function InvoicePDF({ invoice, profile }: InvoicePDFProps) {
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        <View style={styles.header}>
          <View>
            <Text style={styles.businessName}>{profile.business_name || "TradeFlow"}</Text>
            {profile.phone ? <Text style={styles.businessDetail}>{profile.phone}</Text> : null}
            {profile.email ? <Text style={styles.businessDetail}>{profile.email}</Text> : null}
            {profile.address ? <Text style={styles.businessDetail}>{profile.address}</Text> : null}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={[styles.invoiceNumber, { marginTop: 4 }]}>
              Date: {new Date(invoice.created_at).toLocaleDateString("en-CA")}
            </Text>
            {invoice.due_date ? (
              <Text style={styles.invoiceNumber}>
                Due: {new Date(invoice.due_date).toLocaleDateString("en-CA")}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bill To</Text>
          <Text style={[styles.sectionValue, { fontFamily: "Helvetica-Bold" }]}>
            {invoice.customer_name}
          </Text>
          {invoice.customer_phone ? (
            <Text style={styles.sectionValue}>{invoice.customer_phone}</Text>
          ) : null}
          {invoice.customer_address ? (
            <Text style={styles.sectionValue}>{invoice.customer_address}</Text>
          ) : null}
        </View>

        {invoice.job_address ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Job Location</Text>
            <Text style={styles.sectionValue}>{invoice.job_address}</Text>
          </View>
        ) : null}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}>Qty</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Amount</Text>
          </View>
          {invoice.line_items.map((item, i) => (
            <View key={item.id || i} style={styles.tableRow}>
              <Text style={styles.tableDesc}>{item.description}</Text>
              <Text style={styles.tableQty}>{item.quantity}</Text>
              <Text style={styles.tablePrice}>{fmt(item.unit_price)}</Text>
              <Text style={styles.tableAmount}>{fmt(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{fmt(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>HST ({invoice.tax_rate}%)</Text>
            <Text style={styles.totalValue}>{fmt(invoice.tax_amount)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{fmt(invoice.total)} CAD</Text>
          </View>
        </View>

        {invoice.stripe_payment_link ? (
          <View style={styles.paymentNote}>
            <Text style={[styles.paymentText, { fontFamily: "Helvetica-Bold", marginBottom: 4 }]}>
              Pay Online
            </Text>
            <Text style={styles.paymentText}>{invoice.stripe_payment_link}</Text>
          </View>
        ) : null}

        {invoice.notes ? (
          <View style={[styles.section, { marginTop: 24 }]}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.sectionValue}>{invoice.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by TradeFlow · tradeflow.app · Thank you for your business
          </Text>
        </View>
      </Page>
    </Document>
  );
}
