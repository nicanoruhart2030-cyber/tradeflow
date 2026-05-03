"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("Check your email to confirm your account, then sign in.");
    }
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
          Get started
        </h1>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
          Start free — no credit card.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
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
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#00CCB0] transition-colors min-h-[44px] disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
