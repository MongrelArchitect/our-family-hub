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
  loading: boolean;
  month: number;
  monthString: string;
  updateDate: (newDate: Date) => void;
  year: number;
}

export default function Day({
  dayNumber,
  daysEvents,
  inNextMonth,
  inPrevMonth,
  isSaturday,
  isTodaysDate,
  loading,
  month,
  monthString,
  updateDate,
  year,
}: Props) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

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
                updateDate={updateDate}
                visible={formVisible}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                  onClick={toggleFormVisible}
                  tabIndex={detailsVisible && !formVisible ? 0 : -1}
                  type="button"
                >
                  + Add event
                </button>
                <ul className="flex flex-col gap-4">
                  {daysEvents && daySchedule.length ? (
                    daySchedule.map((eventId, index) => {
                      const event = daysEvents[+eventId];
                      return (
                        <li
                          className={`${index % 2 === 0 ? "bg-slate-300" : "bg-slate-200"} flex flex-col`}
                          key={`event-id-${eventId}`}
                        >
                          <div className="flex flex-wrap gap-4 p-2">
                            <span className="font-bold">{`${event.eventDate.toLocaleTimeString([], { timeStyle: "short" })}`}</span>
                            <span>{event.title}</span>
                          </div>
                          {event.details ? (
                            <div className="p-2 text-base">{event.details}</div>
                          ) : null}
                        </li>
                      );
                    })
                  ) : (
                    <li>No events scheduled</li>
                  )}
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
        className={`${inPrevMonth || inNextMonth ? "bg-slate-200 text-slate-500" : isTodaysDate ? "bg-amber-100" : "bg-slate-100"} ${isSaturday ? null : "border-r-2"} min-h-16 border-b-2 border-slate-600`}
      >
        <button
          className="flex h-full w-full items-start hover:bg-indigo-200 focus:bg-indigo-200"
          onClick={toggleDetailsVisible}
        >
          <div className="pointer-events-none flex h-full w-full flex-col items-start justify-between p-1 text-base">
            <div>{dayNumber}</div>
            {daySchedule.length ? (
              <div className="w-full bg-violet-300 p-2 text-sm">
                {daySchedule.length}
              </div>
            ) : null}
          </div>
        </button>
      </li>
    </>
  );
}
