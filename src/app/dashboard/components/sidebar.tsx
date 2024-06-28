"use client";

import { useState } from "react";
import Image from "next/image";

import openMenuIcon from "@/assets/icons/menu-open.svg";
import closeMenuIcon from "@/assets/icons/menu-close.svg";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* COLLAPSED SIDEBAR */}
      <div className="flex w-[max-content] flex-col items-center bg-violet-200 p-2 lg:hidden">
        <button
          aria-hidden="true"
          onClick={toggleExpanded}
          tabIndex={expanded ? -1 : 0}
          title="Expand sidebar"
          type="button"
        >
          <Image alt="" src={openMenuIcon} width="40" />
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
        className={`${expanded ? "" : "-translate-x-full"} z-20 max-lg:h-full w-[80%] max-w-64 bg-violet-200 p-2 transition-transform max-lg:absolute lg:translate-x-0`}
      >
        <button
          aria-hidden="true"
          className="lg:hidden"
          onClick={toggleExpanded}
          tabIndex={expanded ? 0 : -1}
          title="Collapse sidebar"
          type="button"
        >
          <Image alt="" src={closeMenuIcon} width="40" />
        </button>
        <nav>
          <ul>
            <li tabIndex={expanded ? 0 : -1}>list item</li>
            <li tabIndex={expanded ? 0 : -1}>list item</li>
            <li tabIndex={expanded ? 0 : -1}>list item</li>
            <li tabIndex={expanded ? 0 : -1}>list item</li>
            <li tabIndex={expanded ? 0 : -1}>list item</li>
          </ul>
        </nav>
      </div>
    </>
  );
}
