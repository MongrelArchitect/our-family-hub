"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

import homeIcon from "@/assets/icons/home-group.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import newFamilyIcon from "@/assets/icons/home-plus.svg";
import profileIcon from "@/assets/icons/account-circle.svg";

export default function TopNav() {
  return (
    <nav className="max-lg:hidden">
      <ul className="flex items-center justify-between gap-6">
        <li className="flex">
          <Link
            className="rounded-full border-2 border-slate-600 bg-neutral-100 p-1 hover:bg-indigo-300 focus:bg-indigo-300"
            href="/"
            title="My families"
          >
            <Image alt="" src={homeIcon} width="32" />
          </Link>
        </li>

        <li className="flex">
          <Link
            className="rounded-full border-2 border-slate-600 bg-neutral-100 p-1 hover:bg-indigo-300 focus:bg-indigo-300"
            href="/families/new"
            title="New family"
          >
            <Image alt="" src={newFamilyIcon} width="32" />
          </Link>
        </li>

        <li className="flex">
          <Link
            className="rounded-full border-2 border-slate-600 bg-neutral-100 p-1 hover:bg-indigo-300 focus:bg-indigo-300"
            href="/users/me"
            title="My profile"
          >
            <Image alt="" src={profileIcon} width="32" />
          </Link>
        </li>

        <li className="flex">
          <button
            className="rounded-full border-2 border-slate-600 bg-neutral-100 p-1 hover:bg-indigo-300 focus:bg-indigo-300"
            onClick={() => {
              signOut();
            }}
            title="Log out"
            type="button"
          >
            <Image alt="" src={logoutIcon} width="32" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
