"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

import closeMenuIcon from "@/assets/icons/menu-close.svg";
import homeIcon from "@/assets/icons/home.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import newFamilyIcon from "@/assets/icons/new-family.svg";
import openMenuIcon from "@/assets/icons/menu-open.svg";


export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* COLLAPSED SIDEBAR */}
      <div className="z-10 flex w-[max-content] flex-shrink-0 flex-col items-center bg-violet-200 p-2 shadow-md shadow-slate-600 lg:hidden">
        <button
          aria-hidden="true"
          onClick={toggleExpanded}
          tabIndex={expanded ? -1 : 0}
          title="Expand sidebar"
          type="button"
        >
          <Image alt="" src={openMenuIcon} width="48" />
        </button>
      </div>

      {/* GRAYOUT */}
      <button
        aria-hidden="true"
        className={`${expanded ? "absolute" : "hidden"} left-0 top-0 z-10 h-full w-full bg-neutral-600/20 backdrop-blur-sm lg:hidden`}
        type="button"
        onClick={toggleExpanded}
        tabIndex={-1}
      ></button>

      {/* EXPANDED SIDEBAR */}
      <div
        className={`${expanded ? "" : "-translate-x-full"} z-20 flex w-[80%] max-w-64 flex-col items-start gap-4 bg-violet-200 p-2 shadow-md shadow-slate-600 transition-transform max-lg:absolute max-lg:h-full lg:translate-x-0`}
      >
        <button
          aria-hidden="true"
          className="lg:hidden"
          onClick={toggleExpanded}
          tabIndex={expanded ? 0 : -1}
          title="Collapse sidebar"
          type="button"
        >
          <Image alt="" src={closeMenuIcon} width="48" />
        </button>
        <nav className="text-xl">
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                className="flex flex-wrap items-center gap-2 hover:underline focus:underline"
                href="/dashboard/"
                onClick={toggleExpanded}
                tabIndex={expanded ? 0 : -1}
              >
                <Image alt="" src={homeIcon} width="32" />
                Home
              </Link>
            </li>
            <li>
              <Link
                className="flex flex-wrap items-center gap-2 hover:underline focus:underline"
                href="/dashboard/newfamily"
                onClick={toggleExpanded}
                tabIndex={expanded ? 0 : -1}
              >
                <Image alt="" src={newFamilyIcon} width="32" />
                New Family
              </Link>
            </li>
            <li>
              <button
                className="flex flex-wrap items-center gap-2 hover:underline focus:underline"
                onClick={() => {signOut()}}
                tabIndex={expanded ? 0 : -1}
                type="submit"
              >
                <Image alt="" src={logoutIcon} width="32" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
