import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "FlowState — Stop Thinking. Start Doing.",
  description: "A no-excuses productivity tool for people who already know what to do.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-base text-body antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
