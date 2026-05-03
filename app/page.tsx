import Link from "next/link";
import { Mic, Zap, CreditCard, FileText, MessageSquare, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-4 sm:px-8 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-[#080810]" strokeWidth={2.5} />
          </div>
          <span className="font-syne font-extrabold text-lg text-[var(--text-primary)]">
            TradeFlow
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="text-sm text-[var(--text-secondary)] px-3 py-2.5 min-h-[44px] rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] hover:bg-[var(--accent-dim)] transition-all inline-flex items-center"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-[#080810] bg-[var(--accent)] px-4 py-2.5 min-h-[44px] rounded-lg hover:bg-[#00CCB0] transition-colors inline-flex items-center"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-12 max-w-6xl mx-auto overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 229, 160, 0.12) 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <div className="relative max-w-3xl">
            <h1 className="font-syne font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] leading-tight mb-6">
              Speak the job.
              <br />
              Send the invoice.
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[#00CCB0] bg-clip-text text-transparent">
                Get paid today.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8 max-w-xl">
              Voice-to-invoice AI for plumbers, electricians &amp; HVAC technicians. No setup. No
              spreadsheets. Works in 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-base font-medium text-[#080810] bg-[var(--accent)] px-6 py-3 min-h-[48px] rounded-lg hover:bg-[#00CCB0] transition-colors text-center"
              >
                Start free — no credit card
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-base font-medium text-[var(--text-primary)] px-6 py-3 min-h-[48px] rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] hover:bg-[var(--accent-dim)] transition-all text-center"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-8 pb-12 max-w-6xl mx-auto w-full">
          <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)] mb-4">
            Three steps
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                icon: Mic,
                title: "Speak",
                body: "Describe the job out loud after it's done",
              },
              {
                icon: Zap,
                title: "Parse",
                body: "AI builds the invoice from your words in 3 seconds",
              },
              {
                icon: CreditCard,
                title: "Collect",
                body: "Customer pays via text link. Money hits today.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--border-bright)] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center mb-4 text-[var(--accent)]">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-syne font-extrabold text-lg text-[var(--text-primary)] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-8 pb-16 max-w-6xl mx-auto">
          <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)] mb-4">
            Built for the field
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                icon: FileText,
                title: "PDF invoices",
                body: "Professional line items, tax, and totals — ready to download or text.",
              },
              {
                icon: MessageSquare,
                title: "SMS with pay link",
                body: "Customer gets a Stripe link on their phone. No app required.",
              },
              {
                icon: Shield,
                title: "Stripe-secured",
                body: "Card payments and webhooks mark invoices paid automatically.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5"
              >
                <div className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center mb-3 text-[var(--accent)]">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-syne font-extrabold text-base text-[var(--text-primary)] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-8 pb-12 max-w-6xl mx-auto">
          <p className="text-center text-sm text-[var(--text-muted)] border border-[var(--border)] rounded-lg py-4 px-4">
            Built for the 7 million solo tradespeople running on WhatsApp and paper
          </p>
        </section>

        <section className="px-4 sm:px-8 pb-16 max-w-6xl mx-auto text-center">
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)] mb-3">
            Ready in one minute
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Create an account, add your business name, and send your first invoice from the van.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center text-base font-medium text-[#080810] bg-[var(--accent)] px-8 py-3 min-h-[48px] rounded-lg hover:bg-[#00CCB0] transition-colors"
          >
            Create free account
          </Link>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] mt-auto py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <span className="font-syne font-extrabold text-[var(--text-secondary)]">TradeFlow</span>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login" className="hover:text-[var(--text-secondary)]">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-[var(--text-secondary)]">
              Sign up
            </Link>
            <Link href="/dashboard" className="hover:text-[var(--text-secondary)]">
              App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
