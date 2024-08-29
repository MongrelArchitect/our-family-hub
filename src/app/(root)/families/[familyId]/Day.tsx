"use client";

import { useState } from "react";

import Card from "@/components/Card";
import Loading from "@/components/Loading";
import NewEventForm from "./NewEventForm";

import EventInterface from "@/types/Events";

interface Props {
  dayNumber: number;
  daysEvents: null | { [key: number]: EventInterface };
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
  daysEvents,
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

  // can have multiple events per day
  let daySchedule: string[] = [];
  if (daysEvents) {
    daySchedule = Object.keys(daysEvents);
    if (daySchedule.length > 1) {
      daySchedule.sort((a, b) => {
        const eventA = daysEvents[+a];
        const eventB = daysEvents[+b];
        const timeA = eventA.eventDate.getTime();
        const timeB = eventB.eventDate.getTime();
        return timeA - timeB;
      });
    }
  }

  const clearForm = () => {};

  const toggleFormVisible = () => {
    setFormVisible(!formVisible);
  };

  const showDetails = () => {
    return (
      <div
        aria-hidden={detailsVisible}
        className={`${detailsVisible ? null : "pointer-events-none opacity-0"} fixed left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 font-sans backdrop-blur-sm transition-all`}
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
                <ul className="flex flex-col gap-4">
                  {daysEvents && daySchedule.length
                    ? daySchedule.map((eventId, index) => {
                        const event = daysEvents[+eventId];
                        return (
                          <li
                            className={`${index % 2 === 0 ? "bg-slate-300" : "bg-slate-200"} flex flex-col`}
                            key={`event-id-${eventId}`}
                          >
                            <div className="p-2 flex flex-wrap gap-4">
                              <span className="font-bold">{`${event.eventDate.toLocaleTimeString([], { timeStyle: "short" })}`}</span>
                              <span>{event.title}</span>
                            </div>
                              {event.details ? <div className="text-base p-2">{event.details}</div> : null}
                          </li>
                        );
                      })
                    : null}
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
