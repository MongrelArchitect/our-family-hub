"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

import closeMenuIcon from "@/assets/icons/menu-close.svg";
import familyIcon from "@/assets/icons/family.svg";
import homeIcon from "@/assets/icons/home.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import newFamilyIcon from "@/assets/icons/new-family.svg";
import openMenuIcon from "@/assets/icons/menu-open.svg";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // need to be sure we're on the client so we can use `window`
    setIsClient(true);
  }, []);

  useEffect(() => {
    // links rely on "expanded" for tab-indexing
    if (isClient) {
      if (window.innerWidth >= 1024) {
        // on first client render
        setExpanded(true);
      }
      window.addEventListener("resize", () => {
        // if the user changes their window size
        if (window.innerWidth < 1024) {
          setExpanded(false);
        } else {
          setExpanded(true);
        }
      });
    }
  }, [isClient]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* COLLAPSED SIDEBAR */}
      <div className="bg-violet-300 lg:hidden">
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
        className={`${expanded ? "absolute" : "hidden"} left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 backdrop-blur-sm lg:hidden`}
        type="button"
        onClick={toggleExpanded}
        tabIndex={-1}
      ></button>

      {/* EXPANDED SIDEBAR */}
      <div
        className={`${expanded ? "" : "-translate-x-full"} left-0 top-0 z-20 flex h-full max-w-[max-content] select-none flex-col items-start gap-4 bg-violet-200 p-2 transition-transform max-lg:absolute max-lg:h-screen max-lg:border-r-2 max-lg:border-violet-400 lg:translate-x-0`}
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
                href="/"
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
                href="/families/all"
                onClick={toggleExpanded}
                tabIndex={expanded ? 0 : -1}
              >
                <Image alt="" src={familyIcon} width="32" />
                My Families
              </Link>
            </li>

            <li>
              <Link
                className="flex flex-wrap items-center gap-2 hover:underline focus:underline"
                href="/families/new"
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
                onClick={() => {
                  signOut();
                }}
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
