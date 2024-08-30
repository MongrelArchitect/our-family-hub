"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import nextIcon from "@/assets/icons/chevron-right.svg";
import prevIcon from "@/assets/icons/chevron-left.svg";
import todayIcon from "@/assets/icons/calendar-today.svg";
import Card from "@/components/Card";
import Day from "./Day";
import Loading from "@/components/Loading";

import { getCalendarEvents } from "@/lib/db/events";

import EventInterface, { CalendarEventsData } from "@/types/Events";

export default function Calendar() {
  const { familyId } = useParams<{ familyId: string }>();

  const [date, setDate] = useState<Date | null>(null);
  const [calendar, setCalendar] = useState({
    dayOne: 0,
    lastDate: 0,
    prevLastDate: 0,
  });
  const [error, setError] = useState<null | string>(null);
  const [events, setEvents] = useState<CalendarEventsData | null>(null);
  const [loading, setLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const updateDate = (newDate: Date) => {
    setDate(newDate);
  };

  useEffect(() => {
    updateDate(new Date());
  }, []);

  useEffect(() => {
    const getEvents = async (month: number) => {
      try {
        setError(null);
        setLoading(true);
        const eventData = await getCalendarEvents(
          +familyId,
          month,
          new Date().getTimezoneOffset(),
        );
        setEvents(eventData);
      } catch (err) {
        console.error("Error getting event data: ", err);
        setError("Error getting event data");
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      setLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth();
      // first day of the month
      const dayOne = new Date(year, month, 1).getDay();

      // last date of the month
      const lastDate = new Date(year, month + 1, 0).getDate();

      // last date of the previous month
      const prevLastDate = new Date(year, month, 0).getDate();
      setCalendar({
        dayOne,
        lastDate,
        prevLastDate,
      });

      // get events for selected month and adjacent (handle zero index)
      getEvents(month + 1);
    }
  }, [date]);

  const currentMonth = () => {
    setDate(new Date());
  };

  const nextMonth = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      setDate(newDate);
    }
  };

  const prevMonth = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - 1);
      setDate(newDate);
    }
  };

  const checkSaturday = (num: number) => {
    if (num === 6 || num === 13 || num === 20 || num === 27 || num === 34) {
      return true;
    }
    return false;
  };

  const getMonthNumber = (inNextMonth: boolean, inPrevMonth: boolean) => {
    if (date) {
      const currentMonth = date.getMonth();
      if (inNextMonth) {
        if (currentMonth === 11) {
          return 0;
        }
        return currentMonth + 1;
      }
      if (inPrevMonth) {
        if (currentMonth === 0) {
          return 11;
        }
        return currentMonth - 1;
      }
      return currentMonth;
    }
    return 0;
  };

  const getYearNumber = (inNextMonth: boolean, inPrevMonth: boolean) => {
    if (date) {
      if (inNextMonth && date.getMonth() === 11) {
        return date.getFullYear() + 1;
      }
      if (inPrevMonth && date.getMonth() === 0) {
        return date.getFullYear() - 1;
      }
      return date.getFullYear();
    }
    return 0;
  };

  const populateCalendar = () => {
    if (date) {
      const days: number[] = [];
      for (let i = calendar.dayOne; i > 0; i -= 1) {
        days.push(calendar.prevLastDate - (i - 1));
      }
      for (let i = 1; i <= calendar.lastDate; i += 1) {
        days.push(i);
      }
      const daysLeft = 35 - days.length;
      for (let i = 35 - days.length; i > 0; i -= 1) {
        days.push(daysLeft - (i - 1));
      }
      return days.map((day, index) => {
        const inNextMonth = index >= 35 - daysLeft;
        const inPrevMonth = index < calendar.dayOne;
        const isTodaysDate =
          new Date().getDate() === day &&
          new Date().getMonth() === date?.getMonth() &&
          new Date().getFullYear() === date?.getFullYear();
        let daysEvents: { [key: number]: EventInterface } | null = null;
        if (events) {
          if (!inNextMonth && !inPrevMonth) {
            if (events.current[day]) {
              daysEvents = events.current[day];
            }
          }
          if (inNextMonth) {
            if (events.next[day]) {
              daysEvents = events.next[day];
            }
          }
          if (inPrevMonth) {
            if (events.prev[day]) {
              daysEvents = events.prev[day];
            }
          }
        }
        return (
          <Day
            dayNumber={day}
            daysEvents={daysEvents}
            key={`${getYearNumber(inNextMonth, inPrevMonth)}-${getMonthNumber(inNextMonth, inPrevMonth)}-${day}`}
            loading={loading}
            month={date.getMonth()}
            monthString={months[getMonthNumber(inNextMonth, inPrevMonth)]}
            inNextMonth={inNextMonth}
            inPrevMonth={inPrevMonth}
            isSaturday={checkSaturday(index)}
            isTodaysDate={isTodaysDate}
            updateDate={updateDate}
            year={getYearNumber(inNextMonth, inPrevMonth)}
          />
        );
      });
    }
    return null;
  };

  if (loading) {
    return (
      <Card
        borderColor="border-fuchsia-400"
        heading="Event Calendar"
        headingColor="bg-fuchsia-200"
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <Loading />
        </div>
      </Card>
    );
  }

  if (error) {
    // will show the error page
    throw new Error(
      `There was a problem generating the event calendar. ${error}`,
    );
  }

  return (
    <Card
      borderColor="border-fuchsia-400"
      heading="Event Calendar"
      headingColor="bg-fuchsia-200"
    >
      {date ? (
        <div className="grid min-h-[300px] grid-rows-[auto_1fr]">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-xl">{`${months[date.getMonth()]} ${date.getFullYear()}`}</h3>
            <div className="flex flex-wrap items-center">
              <button
                aria-label="Previous month"
                onClick={prevMonth}
                title="Previous month"
                type="button"
              >
                <Image alt="" src={prevIcon} width={40} />
              </button>
              <button
                aria-label="Current month"
                onClick={currentMonth}
                title="Current month"
                type="button"
              >
                <Image alt="" src={todayIcon} width={28} />
              </button>
              <button
                aria-label="Next month"
                onClick={nextMonth}
                title="Next month"
                type="button"
              >
                <Image alt="" src={nextIcon} width={40} />
              </button>
            </div>
          </div>
          <div className="grid grid-rows-[auto_1fr] font-mono">
            <ul className="grid grid-cols-7 border-2 border-slate-600">
              <li className="p-2">SUN</li>
              <li className="p-2">MON</li>
              <li className="p-2">TUE</li>
              <li className="p-2">WED</li>
              <li className="p-2">THU</li>
              <li className="p-2">FRI</li>
              <li className="p-2">SAT</li>
            </ul>
            <ol className="grid grid-cols-7 border-2 border-t-0 border-slate-600">
              {populateCalendar()}
            </ol>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loading />
        </div>
      )}
    </Card>
  );
}
