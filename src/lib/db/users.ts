"use server";

import { cache } from "react";
import pool from "./pool";

import getUserId from "../auth/user";

import InviteInterface from "@/types/Invites";
import UserInterface from "@/types/Users";
import { revalidatePath } from "next/cache";

export async function addUserToDatabase(user: {
  // return the id of the newly created user
  name: string;
  email: string;
}): Promise<number> {
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
      [user.name, user.email],
    );
    return result.rows[0].id;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export async function deleteUser() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userId = await getUserId();

    // first check if user is admin of any family, if so they can't be deleted
    const adminQuery = `
      SELECT EXISTS(
        SELECT 1
        FROM families
        WHERE admin_id = $1
      )
    `;
    const adminResult = await client.query(adminQuery, [userId]);
    const userIsAdminOfAFamily = adminResult.rows[0].exists ? true : false;
    if (userIsAdminOfAFamily) {
      throw new Error(
        "User cannot be deleted because they are admin of one or more families",
      );
    }

    // not an admin, so first remove the user from all family membership
    const memberQuery = `
      DELETE FROM family_members
      WHERE member_id = $1
    `;
    await client.query(memberQuery, [userId]);

    // don't forget to remove any pending invites
    const invitesQuery = `
      DELETE FROM invites
      WHERE user_id = $1
    `;
    await client.query(invitesQuery, [userId]);

    // now we need to replace all the user's content with the "Former Member" user

    // starting with tasks
    const tasksQuery = `
      UPDATE tasks
      SET created_by = 1
      WHERE created_by = $1
    `;
    await client.query(tasksQuery, [userId]);

    // then todo lists
    const todosQuery = `
      UPDATE todo_lists 
      SET created_by = 1
      WHERE created_by = $1
    `;
    await client.query(todosQuery, [userId]);

    // now thread posts
    const postsQuery = `
      UPDATE posts
      SET author_id = 1
      WHERE author_id = $1
    `;
    await client.query(postsQuery, [userId]);

    // then threads themselves
    const threadsQuery = `
      UPDATE threads 
      SET author_id = 1
      WHERE author_id = $1
    `;
    await client.query(threadsQuery, [userId]);

    // then calendar events
    const eventsQuery = `
      UPDATE events
      SET created_by = 1
      WHERE created_by = $1
    `;
    await client.query(eventsQuery, [userId]);

    // finally delete the user
    const userQuery = `
      DELETE FROM users
      WHERE id = $1
    `;
    await client.query(userQuery, [userId]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    // XXX TODO XXX
    // log this
    throw err;
  } finally {
    client.release();
  }
}

export async function editUserName(formData: FormData) {
  try {
    // XXX TODO XXX
    // input validation & rate limiting
    const newName = formData.get("name");
    if (!newName) {
      throw new Error("Error editing user name: name required");
    }
    const userId = await getUserId();
    const query = `
      UPDATE users
      SET name = $2
      WHERE id = $1
    `;
    const result = await pool.query(query, [userId, newName]);
    if (!result.rowCount) {
      throw new Error("Error editing user name");
    }
    revalidatePath("/users/me");
    revalidatePath(`/users/${userId}`);
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export async function getUserIdFromEmail(email: string): Promise<number> {
  // will return user id if they exist, or 0 if not
  try {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length) {
      return result.rows[0].id;
    }
    return 0;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export const getUsersInvites = cache(async (userId: number) => {
  try {
    const result = await pool.query(
      "SELECT family_id, created_at FROM invites WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    const invites: InviteInterface[] = [];
    result.rows.forEach((row) => {
      invites.push({
        familyId: row.family_id,
        createdAt: row.created_at,
      });
    });
    return invites;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const checkIfSameFamily = cache(async (userId: number) => {
  try {
    const authUserId = await getUserId();
    const query = `
        SELECT 1
        FROM family_members fm1
        JOIN family_members fm2
        ON fm1.family_id = fm2.family_id
        WHERE fm1.member_id = $1
        AND fm2.member_id = $2
      `;
    const result = await pool.query(query, [authUserId, userId]);
    if (!result.rowCount) {
      return false;
    }
    return true;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const getOtherUsersInfo = cache(async (userId: number) => {
  try {
    const authUserId = await getUserId();

    // only get other user's info if they share a family in common or
    // if they're querying for the "Former Member" use with id of 1
    const query = `
        WITH shared_family_check AS (
          SELECT 1
          FROM family_members fm1
          JOIN family_members fm2
          ON fm1.family_id = fm2.family_id
          WHERE fm1.member_id = $1
          AND fm2.member_id = $2
        )
        SELECT id, email, name, created_at, last_login_at
        FROM users
        WHERE id = $2
        AND (
          EXISTS (SELECT 1 FROM shared_family_check)
          OR $2 = 1
        )
      `;

    const result = await pool.query(query, [authUserId, userId]);

    if (!result.rowCount) {
      throw new Error("No user found");
    }

    const user: UserInterface = {
      id: result.rows[0].id as number,
      name: result.rows[0].name as string,
      email: result.rows[0].email as string,
      createdAt: new Date(result.rows[0].created_at as string),
      lastLoginAt: new Date(result.rows[0].last_login_at as string),
    };

    return user;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const getUsersOwnInfo = cache(async () => {
  try {
    const userId = await getUserId();
    const query = `
      SELECT email, name, created_at, last_login_at
      FROM users
      WHERE id = $1
      ;
    `;
    const result = await pool.query(query, [userId]);
    if (!result.rowCount) {
      throw new Error("Error getting user's own info");
    }
    const row = result.rows[0];
    const userInfo: UserInterface = {
      id: userId,
      name: row.name as string,
      email: row.email as string,
      createdAt: new Date(row.created_at as string),
      lastLoginAt: new Date(row.last_login_at as string),
    };
    return userInfo;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export async function updateUserLoginTimestamp(userId: number) {
  try {
    const result = await pool.query(
      "UPDATE users SET last_login_at = NOW() WHERE id = $1",
      [userId],
    );
    return result;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}
