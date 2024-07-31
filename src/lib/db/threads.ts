"use server";
import { revalidatePath } from "next/cache";
import { cache } from "react";

import pool from "./pool";

import { ThreadInterface } from "@/types/Threads";
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
    revalidatePath(`/families/${familyId}/`);
    return +result.rows[0].id;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export const getThreadInfo = cache(
  async (threadId: number, familyId: number) => {
    try {
      const userId = await getUserId();
      const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT t.id, t.author_id, t.family_id, t.title, t.content, t.created_at, 
      COUNT(p.id) + 1 AS post_count
      FROM threads t
      LEFT JOIN posts p
      ON t.id = p.thread_id
      GROUP BY t.id
      HAVING t.id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      ;
    `;
      const result = await pool.query(query, [userId, familyId, threadId]);
      if (!result.rowCount) {
        // rowCount will be 1 if successfully created, 0 if not
        throw new Error("Error getting thread info");
      }
      const threadInfo: ThreadInterface = {
        id: +result.rows[0].id as number,
        authorId: +result.rows[0].author_id as number,
        familyId: +result.rows[0].family_id as number,
        title: result.rows[0].title as string,
        content: result.rows[0].content as string,
        createdAt: new Date(result.rows[0].created_at as string),
        postCount: +result.rows[0].post_count,
      };

      return threadInfo;
    } catch (err) {
      // XXX TODO XXX
      // log this
      throw err;
    }
  },
);

export const getThreadSummaries = cache(async (familyId: number) => {
  try {
    const userId = await getUserId();
    // XXX TODO XXX
    // sort by latest post...or what?
    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT t.id, t.author_id, t.family_id, t.title, t.content, t.created_at, 
      COUNT(p.id) + 1 AS post_count
      FROM threads t
      LEFT JOIN posts p
      ON t.id = p.thread_id
      GROUP BY t.id
      HAVING EXISTS(SELECT 1 FROM member_check)
      ;
    `;
    const result = await pool.query(query, [userId, familyId]);
    const threads: ThreadInterface[] = [];
    result.rows.forEach((row) => {
      const thread: ThreadInterface = {
        id: +row.id as number,
        authorId: +row.author_id as number,
        familyId: +row.family_id as number,
        title: row.title as string,
        content: row.content as string,
        createdAt: new Date(row.created_at as string),
        postCount: +row.post_count,
      };
      threads.push(thread);
    });
    return threads;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});
