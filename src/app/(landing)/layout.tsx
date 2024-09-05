import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import "@/app/globals.css";

import logoIcon from "@/assets/icons/logo-white.png";

import { auth } from "@/auth";

import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Our Family Hub",
  description: "A place for families to discuss, plan, organize and more!",
  manifest: "site.webmanifest",
};

export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <html
      className={`${inter.className} flex flex-col items-center bg-[url('/background.webp')] bg-cover bg-center text-lg`}
      lang="en"
    >
      <body className="flex h-screen w-full max-w-[1024px] flex-col overflow-hidden bg-[url('/texture.webp')] shadow-lg shadow-slate-800">
        <header className="flex w-full select-none items-center justify-between gap-2 border-b-2 border-violet-400 bg-violet-200 p-2">
          <div className="flex items-center gap-2">
            <Image alt="" src={logoIcon} width="40" />
            <h1 className="text-2xl">
              <Link
                className="focus:underline hover:underline"
                href="/landing"
              >
                <b>Our Family Hub</b>
              </Link>
            </h1>
          </div>
        </header>
        <main className="overflow-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
