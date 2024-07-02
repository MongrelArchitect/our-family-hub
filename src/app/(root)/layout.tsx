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
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-violet-300 p-2">
            <div className="flex flex-wrap items-center gap-2">
              <Image alt="" src={logoIcon} width="40" />
              <h1 className="text-3xl">
                <b>Our Family Hub</b>
              </h1>
            </div>
            <UserImage
              className="rounded-full border-2 border-black bg-white max-lg:hidden"
              width={40}
            />
          </div>
          {children}
        </div>
      </div>
      </body>
    </html>
  );
}
