import Image from "next/image";

import Sidebar from "./components/sidebar";
import UserImage from "./components/userimage";

import logoIcon from "@/assets/icons/logo-white.png";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
