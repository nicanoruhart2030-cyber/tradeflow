"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import VoiceRecorder from "@/components/VoiceRecorder";
import { JobParser } from "@/components/JobParser";
import { InvoicePreview } from "@/components/InvoicePreview";
import { Spinner } from "@/components/ui/Spinner";
import { calculateTotals } from "@/lib/utils";
import type { LineItem, ParsedJob } from "@/types";

type Tab = "voice" | "manual";
type Step = "input" | "review" | "success";

export function NewInvoiceClient() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("voice");
  const [step, setStep] = useState<Step>("input");
  const [transcript, setTranscript] = useState("");
  const [parseLoading, setParseLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<"draft" | "send" | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [jobAddress, setJobAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(13);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [successInvoice, setSuccessInvoice] = useState<{
    id: string;
    number: string;
    link: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const data = (await res.json()) as { tax_rate?: number };
      if (!cancelled && data?.tax_rate != null) {
        setTaxRate(Number(data.tax_rate));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(
    () => calculateTotals(lineItems, taxRate),
    [lineItems, taxRate]
  );

  const parseJob = async () => {
    if (!transcript.trim()) {
      setError("Add a job description first.");
      return;
    }
    setParseLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcript.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parse failed");
      const parsed = data as ParsedJob;
      setCustomerName(parsed.customer_name || "Customer");
      setCustomerPhone(parsed.customer_phone || "");
      setJobAddress(parsed.job_address || "");
      setNotes(parsed.notes || "");
      const rawLines = (parsed.line_items || []) as Array<
        Omit<LineItem, "id"> & { id?: string }
      >;
      setLineItems(
        rawLines.map((li) => ({
          id: li.id ?? crypto.randomUUID(),
          description: String(li.description || ""),
          quantity: Number(li.quantity) || 0,
          unit_price: Number(li.unit_price) || 0,
          amount: Number(li.amount) || 0,
        }))
      );
      setStep("review");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Parse failed");
    } finally {
      setParseLoading(false);
    }
  };

  const buildPayload = () => ({
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: "",
    customer_address: "",
    job_description: transcript,
    job_address: jobAddress,
    line_items: lineItems,
    subtotal: totals.subtotal,
    tax_rate: taxRate,
    tax_amount: totals.tax_amount,
    total: totals.total,
    notes,
  });

  const saveInvoice = async () => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Save failed");
    return data as { id: string; invoice_number: string };
  };

  const handleSaveDraft = async () => {
    setSaveLoading("draft");
    setError(null);
    try {
      await saveInvoice();
      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaveLoading(null);
    }
  };

  const handleSaveAndSend = async () => {
    setSaveLoading("send");
    setError(null);
    try {
      const inv = await saveInvoice();
      const sendRes = await fetch(`/api/invoices/${inv.id}/send`, { method: "POST" });
      const sendData = await sendRes.json();
      if (!sendRes.ok) throw new Error(sendData.error || "Send failed");
      setSuccessInvoice({
        id: inv.id,
        number: inv.invoice_number,
        link: sendData.payment_link as string,
      });
      setStep("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSaveLoading(null);
    }
  };

  if (step === "success" && successInvoice) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 px-4 fade-up">
        <h1 className="font-syne font-extrabold text-2xl text-[var(--text-primary)] mb-2">
          Invoice sent
        </h1>
        <p className="text-[var(--text-secondary)] mb-2">
          {successInvoice.number} is live. Payment link:
        </p>
        <p className="font-mono text-xs text-[var(--accent)] break-all mb-6 border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-surface)]">
          {successInvoice.link}
        </p>
        <a
          href={`/invoice/${successInvoice.id}`}
          className="inline-flex items-center justify-center bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#00CCB0] min-h-[44px]"
        >
          View invoice
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
          New invoice
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Voice or type the job, then review totals before you send.
        </p>
      </div>

      {step === "input" ? (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("voice")}
              className={`px-4 py-2.5 rounded-lg text-sm border min-h-[44px] transition-all ${
                tab === "voice"
                  ? "bg-[var(--accent-dim)] border-[rgba(0,229,160,0.2)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-bright)]"
              }`}
            >
              Voice
            </button>
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={`px-4 py-2.5 rounded-lg text-sm border min-h-[44px] transition-all ${
                tab === "manual"
                  ? "bg-[var(--accent-dim)] border-[rgba(0,229,160,0.2)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-bright)]"
              }`}
            >
              Manual
            </button>
          </div>

          {tab === "voice" ? (
            <VoiceRecorder
              onTranscript={(t) => {
                setTranscript(t);
                setError(null);
              }}
              onError={setError}
            />
          ) : (
            <div className="space-y-2">
              <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Job description
              </label>
              <textarea
                rows={8}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] resize-none font-mono"
                placeholder="Type the same details you would say out loud…"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
          )}

          {transcript ? (
            <div>
              <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
                Transcript
              </label>
              <textarea
                readOnly
                rows={4}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] rounded-lg px-3 py-2.5 text-sm resize-none"
                value={transcript}
              />
            </div>
          ) : null}

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

          <button
            type="button"
            onClick={parseJob}
            disabled={parseLoading || !transcript.trim()}
            className="bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#00CCB0] transition-colors min-h-[44px] disabled:opacity-40 inline-flex items-center gap-2"
          >
            {parseLoading ? (
              <>
                <Spinner size={16} />
                AI is reading your job…
              </>
            ) : (
              "Parse job →"
            )}
          </button>
        </>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <JobParser
              customerName={customerName}
              customerPhone={customerPhone}
              jobAddress={jobAddress}
              lineItems={lineItems}
              notes={notes}
              taxRate={taxRate}
              onCustomerName={setCustomerName}
              onCustomerPhone={setCustomerPhone}
              onJobAddress={setJobAddress}
              onNotes={setNotes}
              onTaxRate={setTaxRate}
              onLineItemsChange={setLineItems}
            />
            {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={!!saveLoading}
                className="flex-1 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-sm px-4 py-2.5 rounded-lg hover:border-[var(--border-bright)] hover:bg-[var(--accent-dim)] transition-all min-h-[44px] disabled:opacity-50"
              >
                {saveLoading === "draft" ? "Saving…" : "Save draft"}
              </button>
              <button
                type="button"
                onClick={handleSaveAndSend}
                disabled={!!saveLoading}
                className="flex-1 bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#00CCB0] min-h-[44px] disabled:opacity-40"
              >
                {saveLoading === "send" ? "Sending…" : "Save & send"}
              </button>
            </div>
            {!customerPhone.trim() ? (
              <p className="text-xs text-[var(--text-muted)]">
                No phone on file — payment link is created; SMS is skipped until you add a number.
              </p>
            ) : null}
          </div>
          <InvoicePreview
            customerName={customerName}
            customerPhone={customerPhone}
            jobAddress={jobAddress}
            lineItems={lineItems}
            subtotal={totals.subtotal}
            taxRate={taxRate}
            taxAmount={totals.tax_amount}
            total={totals.total}
            notes={notes}
          />
        </div>
      )}
    </div>
  );
}
