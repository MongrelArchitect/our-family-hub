"use server";

import { cache } from "react";
import pool from "./pool";

import getUserId from "../auth/user";

import InviteInterface from "@/types/Invites";
import UserInterface from "@/types/Users";

export async function addUserToDatabase(user: {
  // return the id of the newly created user
  name: string;
  email: string;
  image: string;
}): Promise<number> {
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, image) VALUES ($1, $2, $3) RETURNING id",
      [user.name, user.email, user.image],
    );
    return result.rows[0].id;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error adding new user: ", err);
    throw new Error("Error adding new user");
  }
}

export async function getUserIdFromEmail(email: string): Promise<number> {
  // will return user id if they exist, or 0 if not
  try {
    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length) {
      return result.rows[0].id;
    }
    return 0;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error checking for existing user: ", err);
    throw new Error("Error checking for existing user");
  }
}

export const getUsersInvites = cache(async (userId: number) => {
  try {
    const result = await pool.query("SELECT family_id, created_at FROM invites WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
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
    console.error("Error getting user's invites: ", err);
    throw new Error("Error getting user's invites");
  }
});

export const getUserInfo = cache(async (userId: number, familyId: number) => {
  try {
    const authUserId = await getUserId();

    // only get user info if one making request is member of same family
    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      ),
      family_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $3
        AND family_id = $2
      )
      SELECT id, email, name, image, created_at, last_login_at
      FROM users
      WHERE id = $3
      AND EXISTS(SELECT 1 FROM member_check)
      AND EXISTS (SELECT 1 FROM family_check)
    `;

    const result = await pool.query(query, [
      authUserId,
      familyId,
      userId
    ]);

    if (!result.rowCount) {
      throw new Error("No user found");
    }

    const user: UserInterface = {
      id: result.rows[0].id as number,
      name: result.rows[0].name as string,
      email: result.rows[0].email as string,
      image: result.rows[0].image as string,
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
    console.error("Error updating user's login timestamp: ", err);
    throw new Error("Error updating user's login timestamp");
  }
}
