"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Plus, FileText, Settings, LogOut, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/new", icon: Plus, label: "New Invoice" },
  { href: "/invoices", icon: FileText, label: "Invoices" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    onNavigate?.();
  };

  return (
    <aside className="w-full h-full md:w-56 shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col min-h-screen">
      <div className="p-5 border-b border-[var(--border)]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={() => onNavigate?.()}
        >
          <div className="w-7 h-7 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-[#080810]" strokeWidth={2.5} />
          </div>
          <span className="font-syne font-extrabold text-[var(--text-primary)] text-lg tracking-tight">
            TradeFlow
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5" aria-label="Main">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => onNavigate?.()}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-lg text-sm transition-all border
                ${
                  active
                    ? "bg-[var(--accent-dim)] text-[var(--accent)] border-[rgba(0,229,160,0.2)]"
                    : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border)]"
                }
              `}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-all border border-transparent hover:border-[var(--border)]"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
