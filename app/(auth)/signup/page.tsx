"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="w-full flex justify-center">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
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
