"use server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isEmpty, isLength, trim } from "validator";

import generateError from "../errors/errors";
import pool from "./pool";

import { PostInterface, ThreadInterface } from "@/types/Threads";
import getUserId from "../auth/user";

export async function createNewPost(
  threadId: number,
  familyId: number,
  formData: FormData,
) {
  const userId = await getUserId();
  try {
    let content = formData.get("content");
    if (!content || typeof content !== "string") {
      throw new Error("Missing or invalid content");
    }
    content = trim(content);
    if (isEmpty(content) || !isLength(content, { min: 1, max: 20000 })) {
      throw new Error("Content required - 20,000 characters max");
    }

    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      INSERT INTO posts
      (author_id, thread_id, content)
      SELECT $1, $3, $4
      WHERE EXISTS(SELECT 1 FROM member_check);
    `;
    const result = await pool.query(query, [
      userId,
      familyId,
      threadId,
      content,
    ]);
    if (!result.rowCount) {
      throw new Error("Error creating new post");
    }
    revalidatePath(`/families/${familyId}/`);
    revalidatePath(`/families/${familyId}/threads/${threadId}/`);
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "createNewPost",
          `Error creating new post to thread with id ${threadId} in family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
}

export async function createNewThread(familyId: number, formData: FormData) {
  const userId = await getUserId();
  try {
    let title = formData.get("title");
    if (!title || typeof title !== "string") {
      throw new Error("Missing or invalid title");
    }
    title = trim(title);
    if (isEmpty(title) || !isLength(title, { min: 1, max: 255 })) {
      throw new Error("Title required - 255 characters max");
    }

    let content = formData.get("content");
    if (!content || typeof content !== "string") {
      throw new Error("Missing or invalid content");
    }
    content = trim(content);
    if (isEmpty(content) || !isLength(content, { min: 1, max: 20000 })) {
      throw new Error("Content required - 20,000 characters max");
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
    console.error(
      JSON.stringify(
        generateError(
          err,
          "createNewThread",
          `Error creating new thread in family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
}

export async function deletePost(
  postId: number,
  familyId: number,
  threadId: number,
) {
  const userId = await getUserId();
  try {
    // first delete all the posts for this thread
    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      author_check AS (
        SELECT 1
        FROM posts 
        WHERE id = $3
        AND author_id = $1
      )
      DELETE FROM posts
      WHERE id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND (EXISTS(SELECT 1 FROM admin_check)
      OR EXISTS(SELECT 1 FROM author_check))
    `;
    const result = await pool.query(query, [userId, familyId, postId]);
    if (!result.rowCount) {
      throw new Error("Error deleting post");
    }
    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/threads/${threadId}`);
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "deletePost",
          `Error deleting post from thread with id ${threadId} in family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
}

export async function deleteThread(threadId: number, familyId: number) {
  const userId = await getUserId();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // first delete all the posts for this thread
    const postsQuery = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      author_check AS (
        SELECT 1
        FROM threads
        WHERE id = $3
        AND author_id = $1
      )
      DELETE FROM posts
      WHERE thread_id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND (EXISTS(SELECT 1 FROM admin_check)
      OR EXISTS(SELECT 1 FROM author_check))
    `;
    await client.query(postsQuery, [userId, familyId, threadId]);

    // then delete the thread itself
    const threadQuery = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $2
        AND admin_id = $1
      ),
      author_check AS (
        SELECT 1
        FROM threads
        WHERE id = $3
        AND author_id = $1
      )
      DELETE FROM threads
      WHERE id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND (EXISTS(SELECT 1 FROM admin_check)
      OR EXISTS(SELECT 1 FROM author_check))
    `;
    await client.query(threadQuery, [userId, familyId, threadId]);

    await client.query("COMMIT");
    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/threads/${threadId}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      JSON.stringify(
        generateError(
          err,
          "deleteThread",
          `Error deleting thread with id ${threadId} from family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  } finally {
    client.release();
  }
}

export const getThreadInfo = cache(
  async (threadId: number, familyId: number) => {
    const userId = await getUserId();
    try {
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
      AND t.family_id = $2
      AND EXISTS(SELECT 1 FROM member_check)
      ;
    `;
      const result = await pool.query(query, [userId, familyId, threadId]);
      if (!result.rowCount) {
        return notFound();
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
      console.error(
        JSON.stringify(
          generateError(
            err,
            "getThreadInfo",
            `Error getting info from thread with id ${threadId} in family with id ${familyId}`,
            userId,
          ),
        ),
      );
      throw err;
    }
  },
);

export const getThreadPosts = cache(
  async (familyId: number, threadId: number) => {
    const userId = await getUserId();
    try {
      const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT id, author_id, thread_id, content, created_at
      FROM posts
      WHERE thread_id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      ;
      `;
      const result = await pool.query(query, [userId, familyId, threadId]);
      const posts: PostInterface[] = [];
      result.rows.forEach((row) => {
        const post: PostInterface = {
          id: +row.id as number,
          authorId: +row.author_id as number,
          threadId: +row.thread_id as number,
          content: row.content as string,
          createdAt: new Date(row.created_at as string),
        };
        posts.push(post);
      });
      return posts;
    } catch (err) {
      console.error(
        JSON.stringify(
          generateError(
            err,
            "getThreadPosts",
            `Error getting posts from thread with id ${threadId} in family with id ${familyId}`,
            userId,
          ),
        ),
      );
      throw err;
    }
  },
);

export const getThreadSummaries = cache(async (familyId: number) => {
  const userId = await getUserId();
  try {
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
      HAVING t.family_id = $2
      AND EXISTS(SELECT 1 FROM member_check)
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
    console.error(
      JSON.stringify(
        generateError(
          err,
          "getThreadSummaries",
          `Error getting info about threads for family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
});
