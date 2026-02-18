import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hemut — AI Logistics OS",
  description: "AI-powered operating system for trucking and logistics operations",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-[#f0f2f5] antialiased`}>
        <SessionProvider session={session}>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
