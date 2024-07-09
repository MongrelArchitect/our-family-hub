import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

import logoIcon from "@/assets/icons/logo-white.png";

import Sidebar from "../components/sidebar";
import UserImage from "../components/userimage";

import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Our Family Hub",
  description: "A place for families to discuss, plan, organize and more!",
  manifest: "site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.className} lang="en">
      <body className="bg-neutral-200">
        {/* HEADER */}
        <div className="relative flex items-center bg-violet-200 lg:justify-between">
          <div className="lg:hidden flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex flex-wrap items-center gap-2 p-2">
            <Image alt="" src={logoIcon} width="40" />
            <h1 className="text-2xl">
              <b>Our Family Hub</b>
            </h1>
          </div>
          <div className="p-2 max-lg:hidden">
            <UserImage
              className="rounded-full border-2 border-black bg-white"
              width={40}
            />
          </div>
        </div>

        <div className="max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-[auto_1fr]">
          <div className="max-lg:hidden">
            <Sidebar />
            {/* MAIN CONTENT*/}
          </div>
          <div className="border-t-2 border-violet-400 lg:border-l-2">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
