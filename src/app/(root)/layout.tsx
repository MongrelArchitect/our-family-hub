import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import logoIcon from "@/assets/icons/logo-white.png";
import ProfileContextProvider from "@/contexts/Profile";

import Sidebar from "./Sidebar";
import CurrentUserImage from "./UserImage";

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
  if (!session || !session.user || !session.user.id) {
    redirect("/landing");
  }

  return (
    <ProfileContextProvider>
      <html
        className={`${inter.className} flex flex-col items-center bg-[url('/background.webp')] bg-cover bg-center text-lg`}
        lang="en"
      >
        <body className="flex h-screen w-full max-w-[1024px] flex-col overflow-hidden bg-[url('/texture.webp')] shadow-lg shadow-slate-800">
          {/* HEADER */}
          <div className="relative flex items-center bg-violet-200">
            {/* sidebar for smaller screens */}
            <div className="flex-shrink-0 lg:hidden">
              <Sidebar />
            </div>

            <div className="flex select-none items-center gap-2 p-2">
              <Image alt="" src={logoIcon} width="40" />
              <h1 className="text-2xl">
                <b>Our Family Hub</b>
              </h1>
            </div>
          </div>

          <div className="flex h-full flex-col overflow-hidden lg:grid lg:grid-cols-[auto_1fr]">
            {/* sidebar for larger screens */}
            <div className="border-r-[3px] border-violet-400 max-lg:hidden">
              <Sidebar />
            </div>

            {/* MAIN CONTENT*/}
            <main className="overflow-auto border-t-[2px] border-violet-400 p-2">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ProfileContextProvider>
  );
}
