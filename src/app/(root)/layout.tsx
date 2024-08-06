import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import logoIcon from "@/assets/icons/logo-white.png";

import Sidebar from "./Sidebar";
import UserImage from "./UserImage";

import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "Our Family Hub | %s",
    default: "Our Family Hub",
  },
  description: "A place for families to discuss, plan, organize and more!",
  manifest: "site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) {
    redirect("/landing");
  }

  return (
    <html className={inter.className} lang="en">
      <body className="grid h-screen grid-rows-[auto_1fr] bg-neutral-200">
        {/* HEADER */}
        <div className="relative flex items-center bg-violet-200 lg:justify-between">
          {/* sidebar for smaller screens */}
          <div className="flex-shrink-0 lg:hidden">
            <Sidebar />
          </div>

          <div className="flex select-none flex-wrap items-center gap-2 p-2">
            <Image alt="" src={logoIcon} width="40" />
            <h1 className="text-2xl">
              <b>Our Family Hub</b>
            </h1>
          </div>
          <div className="flex-grow-0 p-2 max-lg:hidden">
            <UserImage
              className="rounded-full border-2 border-black bg-white"
              width={40}
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[auto_1fr]">
          {/* sidebar for larger screens */}
          <div className="max-lg:hidden">
            <Sidebar />
          </div>

          {/* MAIN CONTENT*/}
          <div className="border-t-2 border-violet-400 lg:border-l-2">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
