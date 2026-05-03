"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/dashboard` },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setError(null);
    alert("Check your email for the magic link.");
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-[#080810]" strokeWidth={2.5} />
          </div>
          <span className="font-syne font-extrabold text-xl text-[var(--text-primary)]">
            TradeFlow
          </span>
        </div>

        <h1 className="font-syne font-extrabold text-2xl text-[var(--text-primary)] mb-2 text-center">
          Sign in
        </h1>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
          No onboarding. Jump straight to invoices.
        </p>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 py-2.5 rounded-lg text-sm border transition-all min-h-[44px] ${
              mode === "password"
                ? "bg-[var(--accent-dim)] border-[rgba(0,229,160,0.2)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-bright)]"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`flex-1 py-2.5 rounded-lg text-sm border transition-all min-h-[44px] ${
              mode === "magic"
                ? "bg-[var(--accent-dim)] border-[rgba(0,229,160,0.2)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-bright)]"
            }`}
          >
            Magic link
          </button>
        </div>

        <form onSubmit={mode === "password" ? handlePassword : handleMagic} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {mode === "password" ? (
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          ) : null}

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#00CCB0] transition-colors min-h-[44px] disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "password" ? "Sign in" : "Email magic link"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          No account?{" "}
          <Link href="/signup" className="text-[var(--accent)] hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
