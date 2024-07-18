"use server";
import {revalidatePath} from "next/cache";

import { auth } from "@/auth";

import pool from "./pool";

async function getUserId() {
  const session = await auth();
  if (!session) {
    throw new Error("No session");
  }
  const { user } = session;
  if (!user || !user.id) {
    throw new Error("No user or missing id");
  }
  return +user.id;
}

export async function createNewTodoList(familyId: number, formData: FormData) {
  try {
    const userId = await getUserId();
    // title required
    const title = formData.get("title");
    if (!title) {
      throw new Error("Cannot create family - missing surname");
    }
    // description optional
    const description = formData.get("description");

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      INSERT INTO todo_lists
      (family_id, created_by, title, description)
      SELECT $2, $1, $3, $4
      WHERE EXISTS(SELECT 1 FROM member_check)
      RETURNING id;
    `;

    const result = await pool.query(query, [
      userId,
      familyId,
      title,
      description || null,
    ]);
    if (!result.rowCount) {
      // rowCount will be 1 if successfully created, 0 if not
      throw new Error("Error creating todo list");
    }
    // XXX which paths?
    revalidatePath("");
    return +result.rows[0].id;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}
