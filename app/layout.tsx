import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeFlow — Voice-to-Invoice for Tradespeople",
  description: "Speak the job. Send the invoice. Get paid today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
