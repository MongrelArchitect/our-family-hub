"use client";

import { useState } from "react";

import Card from "@/components/Card";
import Loading from "@/components/Loading";
import NewEventForm from "./NewEventForm";

interface Props {
  dayNumber: number;
  inNextMonth: boolean;
  inPrevMonth: boolean;
  isSaturday: boolean;
  isTodaysDate: boolean;
  month: number;
  monthString: string;
  year: number;
}

export default function Day({
  dayNumber,
  inNextMonth,
  inPrevMonth,
  isSaturday,
  isTodaysDate,
  month,
  monthString,
  year,
}: Props) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearForm = () => {};

  const toggleFormVisible = () => {
    setFormVisible(!formVisible);
  };

  const showDetails = () => {
    return (
      <div
        aria-hidden={detailsVisible}
        className={`${detailsVisible ? null : "pointer-events-none opacity-0"} absolute left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 font-sans backdrop-blur-sm transition-all`}
        id="grayout"
        onClick={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLDivElement;
          // prevent visibility toggling due to clicks bubbling up from input
          if (target.id === "grayout") {
            setDetailsVisible(false);
            setFormVisible(false);
            clearForm();
          }
        }}
      >
        <div
          className={`${detailsVisible ? "" : "-translate-y-full"} transition-all`}
        >
          <Card
            heading={`${monthString} ${dayNumber}, ${year}`}
            headingColor="bg-emerald-200"
          >
            {loading ? (
              <Loading />
            ) : formVisible ? (
              // "date" used to construct db timestamp - add 1 to zero indexed month
              <NewEventForm
                date={`${year}-${inPrevMonth ? month : inNextMonth ? month + 2 : month + 1}-${dayNumber}`}
                toggleFormVisible={toggleFormVisible}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                  onClick={toggleFormVisible}
                  type="button"
                >
                  + Add event
                </button>
                <ul>
                  <li className="flex flex-wrap gap-2">
                    <span className="font-mono">12:30</span>
                    <span>Mock data</span>
                  </li>
                  <li className="flex flex-wrap gap-2">
                    <span className="font-mono">16:45</span>
                    <span>More mock data</span>
                  </li>
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  };

  const toggleDetailsVisible = () => {
    setDetailsVisible(!detailsVisible);
  };

  return (
    <>
      {showDetails()}
      <li
        className={`${inPrevMonth || inNextMonth ? "bg-slate-200 text-slate-500" : isTodaysDate ? "bg-amber-100" : "bg-slate-100"} ${isSaturday ? null : "border-r-2"} border-b-2 border-slate-600`}
      >
        <button
          className="flex h-full w-full items-start p-2 hover:bg-indigo-200 focus:bg-indigo-200"
          onClick={toggleDetailsVisible}
        >
          <div className="pointer-events-none">{dayNumber}</div>
        </button>
      </li>
    </>
  );
}
