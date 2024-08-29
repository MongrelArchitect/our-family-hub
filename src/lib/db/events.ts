"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";

import getUserId from "@/lib/auth/user";
import pool from "./pool";
import EventInterface, { CalendarEventsData } from "@/types/Events";

export async function createNewEvent(formData: FormData, familyId: number) {
  try {
    const userId = await getUserId();

    // XXX TODO XXX
    // input validation & rate limiting
    const title = formData.get("event-title") as string;
    const details = formData.get("event-details") as string;
    const eventDate = formData.get("event-date") as string;
    const eventTime = formData.get("event-time") as string;
    const eventOffset = formData.get("event-offset") as string;
    // XXX

    // need to make sure user's local time selection is converted to db's UTC
    const fullUTCDate = new Date(eventDate);
    const hours = +eventTime.split(":")[0];
    const minutes = +eventTime.split(":")[1];
    fullUTCDate.setHours(hours);
    fullUTCDate.setMinutes(minutes);
    fullUTCDate.setMinutes(fullUTCDate.getMinutes() + +eventOffset);

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      INSERT INTO events
      (
        family_id,
        created_by,
        title,
        details,
        event_date
      )
      SELECT $2, $1, $3, $4, $5
      WHERE EXISTS (SELECT 1 FROM member_check)
    `;

    const result = await pool.query(query, [
      userId,
      familyId,
      title,
      details ? details : null,
      fullUTCDate,
    ]);
    if (!result.rowCount) {
      throw new Error("Error creating new event");
    }
    revalidatePath(`/families/${familyId}/`);
  } catch (err) {
    throw err;
    // XXX TODO XXX
    // log this
  }
}

export const getCalendarEvents = cache(
  async (familyId: number, month: number, offset: number) => {
    try {
      // get events for the month and it's neighbors
      const userId = await getUserId();
      const prevMonth = month - 1;
      const nextMonth = month + 1;
      console.log(month);

      const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT id, family_id, created_by, created_at, title, details, event_date
      FROM events
      WHERE EXTRACT(MONTH FROM event_date) IN ($3, $4, $5)
      AND EXISTS (SELECT 1 FROM member_check)
    `;

      const result = await pool.query(query, [
        userId,
        familyId,
        month,
        nextMonth,
        prevMonth,
      ]);
      const events: CalendarEventsData = {
        prev: {},
        current: {},
        next: {},
      };
      result.rows.forEach((row) => {
        const newEvent: EventInterface = {
          id: row.id as number,
          familyId: row.family_id as number,
          createdBy: row.created_by as number,
          createdAt: new Date(row.created_at as string),
          title: row.title as string,
          eventDate: new Date(row.event_date as string),
        };
        const localizedDate = new Date(newEvent.eventDate);
        localizedDate.setMinutes(newEvent.eventDate.getMinutes() - +offset);
        if (row.details) {
          newEvent.details = row.details as string;
        }
        const newEventMonth = newEvent.eventDate.getMonth() + 1;
        const newEventDate = localizedDate.getDate();
        if (newEventMonth === month) {
          if (!events.current[newEventDate]) {
            events.current[newEventDate] = {};
          }
          events.current[newEventDate][newEvent.id] = newEvent;
        }
        if (newEventMonth === month - 1) {
          if (!events.prev[newEventDate]) {
            events.prev[newEventDate] = {};
          }
          events.prev[newEventDate][newEvent.id] = newEvent;
        }
        if (newEventMonth === month + 1) {
          if (!events.next[newEventDate]) {
            events.next[newEventDate] = {};
          }
          events.next[newEventDate][newEvent.id] = newEvent;
        }
      });
      return events;
    } catch (err) {
      throw err;
      // XXX TODO XXX
      // log this
    }
  },
);
