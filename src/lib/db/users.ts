import { cache } from "react";
import pool from "./pool";

import InviteInterface from "@/types/invites";

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

export async function updateUserLoginTimestamp(email: string) {
  try {
    const result = await pool.query(
      "UPDATE users SET last_login_at = NOW() WHERE email = $1",
      [email],
    );
    return result;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error updating user's login timestamp: ", err);
    throw new Error("Error updating user's login timestamp");
  }
}
