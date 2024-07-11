"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

import plusIcon from "@/assets/icons/plus.svg";
import starIcon from "@/assets/icons/star.svg";

export default function Controls({ userIsAdmin }: { userIsAdmin: boolean }) {
  const [actionsVisible, setActionsVisible] = useState(false);
  const [adminActionsVisible, setAdminActionsVisible] = useState(false);

  const toggleActions = () => {
    setActionsVisible(!actionsVisible);
    setAdminActionsVisible(false);
  };

  const toggleAdminActions = () => {
    setActionsVisible(false);
    setAdminActionsVisible(!adminActionsVisible);
  };

  const bodyClick = (e: MouseEvent) => {
    // for closing the action menus when clicking outside of them
    const target = e.target as HTMLElement;
    if (!target.dataset.menu) {
      // relies on a data-menu attribute that each action menu and all its child
      // elements have (except links - want menus to close when links clicked)
      setActionsVisible(false);
      setAdminActionsVisible(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", bodyClick);
    return () => {
      document.body.removeEventListener("click", bodyClick);
    };
  }, []);

  return (
    <>
      {/*
      <button 
        aria-hidden="true"
        className="absolute -z-10 w-screen h-screen top-0 left-0 bg-red-100"
      />
      */}
      {userIsAdmin ? (
        <>
          {/* SHOW / HIDE ADMIN ACTIONS */}
          <button
            aria-controls="admin-actions"
            aria-expanded={adminActionsVisible ? "true" : "false"}
            className="absolute bottom-2 mt-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 shadow-md shadow-slate-500 hover:bg-amber-200 focus:bg-amber-200 max-lg:left-2 lg:left-44"
            data-menu
            onClick={toggleAdminActions}
            title="Show admin actions"
            type="button"
          >
            <Image
              alt=""
              className="pointer-events-none"
              height="40"
              src={starIcon}
              width="40"
            />
          </button>

          {/* ADMIN ACTIONS */}
          <div
            className={`${adminActionsVisible ? "" : "hidden"} absolute bottom-24 left-2 flex w-[max-content] flex-col gap-2 rounded-lg bg-slate-100 text-xl shadow-sm shadow-slate-500 lg:left-44`}
            data-menu
          >
            <div className="relative z-10 rounded-lg" data-menu>
              <div
                className="absolute -bottom-2 left-1/4 -z-10 h-10 w-10 rotate-45 bg-slate-100 shadow-sm shadow-slate-500"
                data-menu
              />
              <h3 className="bg-amber-200 p-2" data-menu>
                Admin
              </h3>
              <ul
                className="flex flex-col items-start gap-4 rounded-lg bg-slate-100 p-2"
                data-menu
                id="admin-actions"
              >
                <li>
                  <Link className="hover:underline focus:underline" href="#">
                    Send invite
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline focus:underline" href="#">
                    Ban member
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline focus:underline" href="#">
                    Edit family
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : null}

      {/* SHOW / HIDE FAMILY ACTIONS (FOR ALL MEMBERS) */}
      <button
        aria-controls="actions"
        aria-expanded={actionsVisible ? "true" : "false"}
        className="absolute bottom-2 right-2 mt-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 shadow-md shadow-slate-500 hover:bg-indigo-200 focus:bg-indigo-200"
        data-menu
        onClick={toggleActions}
        title="Show family actions"
        type="button"
      >
        <Image
          alt=""
          className="pointer-events-none"
          height="40"
          src={plusIcon}
          width="40"
        />
      </button>

      {/* FAMILY ACTIONS (FOR ALL MEMBERS) */}
      <div
        className={`${actionsVisible ? "" : "hidden"} absolute bottom-24 right-2 flex w-[max-content] flex-col gap-2 rounded-lg bg-slate-100 text-xl shadow-sm shadow-slate-500`}
        data-menu
      >
        <div className="relative z-10 rounded-lg" data-menu>
          <div
            className="absolute -bottom-2 left-1/2 -z-10 h-10 w-10 rotate-45 bg-slate-100 shadow-sm shadow-slate-500"
            data-menu
          />
          <h3 className="bg-violet-200 p-2" data-menu>
            Actions
          </h3>
          <ul
            className="flex flex-col items-start gap-4 rounded-lg bg-slate-100 p-2"
            data-menu
            id="actions"
          >
            <li>
              <Link className="hover:underline focus:underline" href="#">
                Something
              </Link>
            </li>
            <li>
              <Link className="hover:underline focus:underline" href="#">
                Something
              </Link>
            </li>
            <li>
              <Link className="hover:underline focus:underline" href="#">
                Something
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
