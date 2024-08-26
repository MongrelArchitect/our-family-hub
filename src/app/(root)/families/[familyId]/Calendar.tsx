"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import nextIcon from "@/assets/icons/chevron-right.svg";
import prevIcon from "@/assets/icons/chevron-left.svg";
import todayIcon from "@/assets/icons/calendar-today.svg";
import Card from "@/components/Card";
import Loading from "@/components/Loading";

export default function Calendar() {
  const [date, setDate] = useState<Date | null>(null);
  const [calendar, setCalendar] = useState({
    dayOne: 0,
    lastDate: 0,
    prevLastDate: 0,
  });

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

  useEffect(() => {
    setDate(new Date());
  }, []);

  useEffect(() => {
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      // first day of the month
      const dayOne = new Date(year, month, 1).getDay();

      // last date of the month
      const lastDate = new Date(year, month + 1, 0).getDate();

      // last date of the previous month
      const prevLastDate = new Date(year, month, 0).getDate();
      console.log({
        dayOne,
        lastDate,
        prevLastDate,
      });
      setCalendar({
        dayOne,
        lastDate,
        prevLastDate,
      });
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

  const populateCalendar = () => {
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
      const inPrevMonth = index < calendar.dayOne || index >= 35 - daysLeft;
      const isTodaysDate =
        new Date().getDate() === day &&
        new Date().getMonth() === date?.getMonth() &&
        new Date().getFullYear() === date?.getFullYear();
      return (
        <li
          className={`${inPrevMonth ? "bg-slate-200 text-slate-500" : isTodaysDate ? "bg-amber-100" : "bg-slate-100"} ${checkSaturday(index) ? null : "border-r-2"} border-b-2 border-slate-600 p-2`}
          key={index}
        >
          {day}
        </li>
      );
    });
  };

  return (
    <Card heading="Event Calendar" headingColor="bg-emerald-200">
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
        <div className="flex min-h-[300px] items-center justify-center">
          <Loading />
        </div>
      )}
    </Card>
  );
}
