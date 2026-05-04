"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

function SignInPanel() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  return (
    <div className="w-full flex justify-center">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/signup"
        forceRedirectUrl={safeNext}
        appearance={{
          variables: {
            colorPrimary: "#00E5A0",
            colorBackground: "#0c0c14",
            colorInputBackground: "#12121c",
            colorText: "#f4f4f8",
            colorTextSecondary: "#9a9ab0",
            borderRadius: "0.5rem",
          },
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[var(--text-muted)]">Loading…</div>}>
      <SignInPanel />
    </Suspense>
  );
}
