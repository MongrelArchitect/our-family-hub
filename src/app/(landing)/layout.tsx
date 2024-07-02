import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Our Family Hub",
  description: "A place for families to discuss, plan, organize and more!",
  manifest: "site.webmanifest",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.className} lang="en">
      <body className="bg-neutral-200">
        {children}
      </body>
    </html>
  );
}
