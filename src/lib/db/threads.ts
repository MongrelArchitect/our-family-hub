"use server";
import { revalidatePath } from "next/cache";

import pool from "./pool";

import getUserId from "../auth/user";

export async function createNewThread(familyId: number, formData: FormData) {
  // XXX TODO XXX
  // input validation & rate limiting
  try {
    const userId = await getUserId();

    const title = formData.get("title");
    const content = formData.get("content");
    if (!title) {
      throw new Error("Cannot create thread - missing title");
    }
    if (!content) {
      throw new Error("Cannot create thread - missing content");
    }

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      INSERT INTO threads
      (author_id, family_id, title, content)
      SELECT $1, $2, $3, $4
      WHERE EXISTS(SELECT 1 FROM member_check)
      RETURNING id;
    `;

    const result = await pool.query(query, [userId, familyId, title, content]);
    if (!result.rowCount) {
      // rowCount will be 1 if successfully created, 0 if not
      throw new Error("Error creating thread");
    }
    // XXX which paths?
    revalidatePath(`/families/${familyId}/`);
    return +result.rows[0].id;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}
