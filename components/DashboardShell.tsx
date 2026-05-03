"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.6)] md:hidden border-0 cursor-pointer"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`
        fixed z-50 inset-y-0 left-0 w-56 transform transition-transform duration-200 ease-out md:relative md:translate-x-0 md:z-0
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="md:hidden shrink-0 h-14 border-b border-[var(--border)] flex items-center px-3 gap-3 bg-[var(--bg-base)]">
          <button
            type="button"
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="font-syne font-extrabold text-[var(--text-primary)]">
            TradeFlow
          </Link>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
