"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const empty: Profile = {
  id: "",
  business_name: "",
  owner_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  province: "",
  postal_code: "",
  tax_rate: 13,
  created_at: "",
  updated_at: "",
};

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile>(empty);
  const [hstNumber, setHstNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!cancelled && data) setProfile(data as unknown as Profile);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: profile.business_name,
        owner_name: profile.owner_name,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        city: profile.city,
        province: profile.province,
        postal_code: profile.postal_code,
        tax_rate: profile.tax_rate,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Saved.");
    void hstNumber;
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-sm text-[var(--text-muted)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-syne font-extrabold text-2xl text-[var(--text-primary)] mb-2">
          Business settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          These details appear on invoices and PDFs.
        </p>
      </div>

      <form onSubmit={save} className="space-y-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5">
        {[
          ["business_name", "Business name"],
          ["owner_name", "Owner name"],
          ["phone", "Phone"],
          ["email", "Email"],
          ["address", "Street address"],
          ["city", "City"],
          ["province", "Province"],
          ["postal_code", "Postal code"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs text-[var(--text-muted)] mb-1.5">{label}</label>
            <input
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
              value={String(profile[key as keyof Profile] ?? "")}
              onChange={(e) =>
                setProfile((p) => ({ ...p, [key]: e.target.value } as Profile))
              }
            />
          </div>
        ))}
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1.5">Default tax rate (%)</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
            value={profile.tax_rate}
            onChange={(e) =>
              setProfile((p) => ({ ...p, tax_rate: parseFloat(e.target.value) || 0 }))
            }
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1.5">
            HST number (future use)
          </label>
          <input
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
            value={hstNumber}
            onChange={(e) => setHstNumber(e.target.value)}
            placeholder="Not stored yet"
          />
        </div>

        {err ? <p className="text-sm text-[var(--danger)]">{err}</p> : null}
        {msg ? <p className="text-sm text-[var(--accent)]">{msg}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--accent)] text-[#080810] font-medium text-sm px-4 py-2.5 rounded-lg min-h-[44px] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
