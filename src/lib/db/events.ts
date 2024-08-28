"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";

import getUserId from "@/lib/auth/user";
import pool from "./pool";

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
  async (familyId: number, month: number) => {
    try {
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
        prevMonth
      ]);
      return result.rows;
    } catch (err) {
      throw err;
      // XXX TODO XXX
      // log this
    }
  },
);
