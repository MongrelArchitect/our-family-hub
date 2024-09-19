"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";
import { isDate, isEmpty, isInt, isLength, isTime, trim } from "validator";

import getUserId from "@/lib/auth/user";
import generateError from "@/lib/errors/errors";
import pool from "./pool";
import EventInterface, { CalendarEventsData } from "@/types/Events";

export async function createNewEvent(formData: FormData, familyId: number) {
  const userId = await getUserId();
  try {
    /* SANITIZE & VALIDATE */
    let title = formData.get("event-title");
    if (!title || typeof title !== "string") {
      throw new Error("Missing or invalid title");
    }
    title = trim(title);
    if (isEmpty(title) || !isLength(title, { min: 1, max: 255 })) {
      throw new Error("Title required - 255 characters max");
    }

    let details = formData.get("event-details");
    if (details) {
      if (typeof details !== "string") {
        throw new Error("Invalid details");
      }
      details = trim(details);
      if (!isLength(details, { min: 0, max: 1000 })) {
        throw new Error("Details 1000 characters max");
      }
    }

    const eventDate = formData.get("event-date");
    if (
      !eventDate ||
      typeof eventDate !== "string" ||
      !isDate(eventDate, {
        strictMode: true,
        format: "YYYY-MM-DD",
        delimiters: ["-"],
      })
    ) {
      throw new Error("Misisng or invalid date");
    }

    const eventTime = formData.get("event-time");
    if (!eventTime || typeof eventTime !== "string" || !isTime(eventTime)) {
      throw new Error("Missing or invalid time");
    }

    const eventOffset = formData.get("event-offset");
    // max possible offset is 720 (UTC-12), min possible is -840 (UTC+14)
    if (
      !eventOffset ||
      typeof eventOffset !== "string" ||
      !isInt(eventOffset, { min: -840, max: 720 })
    ) {
      throw new Error("Missing or invalid timezone offset");
    }

    // need to make sure user's local time selection is converted to db's UTC
    const fullUTCDate = new Date(eventDate);
    const hours = +eventTime.split(":")[0];
    const minutes = +eventTime.split(":")[1];
    fullUTCDate.setHours(hours);
    fullUTCDate.setMinutes(minutes);
    fullUTCDate.setMinutes(fullUTCDate.getMinutes() + +eventOffset);

    /* QUERY */

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
    console.error(
      JSON.stringify(
        generateError(
          err,
          "createNewEvent",
          "Error creating new calendar event",
          userId,
        ),
      ),
    );
    throw err;
  }
}

export async function deleteEvent(eventId: number, familyId: number) {
  const userId = await getUserId();
  try {
    const query = `
      WITH admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      author_check AS (
        SELECT 1
        FROM events
        WHERE id = $3
        AND created_by = $1
      )
      DELETE FROM events
      WHERE id = $3
      AND (EXISTS(SELECT 1 FROM admin_check)
      OR EXISTS(SELECT 1 FROM author_check))
    `;
    const result = await pool.query(query, [userId, familyId, eventId]);
    if (!result.rowCount) {
      throw new Error("Event not deleted");
    }
    revalidatePath(`/families/${familyId}/`);
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "deleteEvent",
          "Error deleting calendar event",
          userId,
        ),
      ),
    );
    throw err;
  }
}

export const getCalendarEvents = cache(
  async (familyId: number, month: number, offset: number) => {
    const userId = await getUserId();
    try {
      // get events for the month and it's neighbors
      const prevMonth = month === 1 ? 12 : month - 1;
      const nextMonth = month === 12 ? 1 : month + 1;

      const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT id, family_id, created_by, created_at, title, details, event_date
      FROM events
      WHERE family_id = $2
      AND EXTRACT(MONTH FROM event_date) IN ($3, $4, $5)
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
        if (newEventMonth === prevMonth) {
          if (!events.prev[newEventDate]) {
            events.prev[newEventDate] = {};
          }
          events.prev[newEventDate][newEvent.id] = newEvent;
        }
        if (newEventMonth === nextMonth) {
          if (!events.next[newEventDate]) {
            events.next[newEventDate] = {};
          }
          events.next[newEventDate][newEvent.id] = newEvent;
        }
      });
      return events;
    } catch (err) {
      console.error(
        JSON.stringify(
          generateError(
            err,
            "getCalendarEvents",
            "Error getting calendar events for a month and its neighbors",
            userId,
          ),
        ),
      );
      throw err;
    }
  },
);
