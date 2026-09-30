import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { clerkEnabled } from "@/lib/auth-client";
import { StudentProvider } from "@/lib/local/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudentOS AI",
    template: "%s · StudentOS AI",
  },
  description:
    "The intelligent operating layer for student life — study, coding, projects, career, tasks and opportunities in one AI-powered platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const app = (
    <StudentProvider>
      <AppShell>{children}</AppShell>
    </StudentProvider>
  );
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {clerkEnabled ? <ClerkProvider>{app}</ClerkProvider> : app}
      </body>
    </html>
  );
}