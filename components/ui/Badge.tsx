import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-secondary)] ${className}`}
    >
      {children}
    </span>
  );
}
