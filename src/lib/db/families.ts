"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import pool from "./pool";
import { getUserIdFromEmail } from "./users";

import FamilyInterface from "@/types/families";

export async function createNewFamily(formData: FormData): Promise<number> {
  // XXX TODO XXX
  // rate limiting & input validation (surname)
  const client = await pool.connect();
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Cannot create family - no session");
    }
    const { user } = session;
    if (!user || !user.id) {
      throw new Error("Cannot create family - no user or missing id");
    }
    const surname = formData.get("surname");
    if (!surname) {
      throw new Error("Cannot create family - missing surname");
    }
    await client.query("BEGIN");
    // create the family with user as admin
    const familyResult = await client.query(
      "INSERT INTO families (admin_id, surname) VALUES ($1, $2) RETURNING id",
      [+user.id, surname],
    );
    const familyId: number = familyResult.rows[0].id;
    // also add them to the junction table tracking family members
    await client.query(
      "INSERT INTO family_members (family_id, member_id) VALUES ($1, $2)",
      [familyId, +user.id],
    );
    await client.query("COMMIT");
    revalidatePath("/families/all");
    // return the id of the newly created family, for redirecting to its page
    return familyId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
    // XXX TODO XXX
    // log this
  } finally {
    client.release();
  }
}

export const checkIfUserIsFamilyMember = cache(
  async (familyId: number, userId: number): Promise<boolean> => {
    try {
      const res = await pool.query(
        "SELECT EXISTS(SELECT 1 FROM family_members WHERE family_id = $1 AND member_id = $2)",
        [familyId, userId],
      );
      const exists: boolean = res.rows[0].exists;
      return exists;
    } catch (err) {
      // XXX TODO XXX
      // log this
      throw err;
    }
  },
);

export const getAllUsersFamilies = cache(async (userId: number) => {
  try {
    const res = await pool.query(
      "SELECT f.id AS family_id, f.surname, fm.member_count AS member_count, f.admin_id, u.name AS admin_name FROM families f LEFT JOIN (SELECT family_id, COUNT(member_id) AS member_count FROM family_members GROUP BY family_id) fm ON f.id =       fm.family_id LEFT JOIN users u ON f.admin_id = u.id WHERE EXISTS (SELECT 1 FROM family_members WHERE family_id = f.id AND member_id = $1) ORDER BY f.surname",
      [userId],
    );

    const response: FamilyInterface[] = [];

    res.rows.forEach((row) => {
      const family: FamilyInterface = {
        adminId: row.admin_id,
        adminName: row.admin_name,
        id: row.family_id,
        memberCount: +row.member_count,
        surname: row.surname,
      };
      response.push(family);
    });

    return response;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const getFamilySurname = cache(async (familyId: number) => {
  try {
    const res = await pool.query("SELECT surname FROM families WHERE id = $1", [
      familyId,
    ]);
    return res.rows[0].surname as string;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const getFamilyInfo = cache(async (familyId: number) => {
  try {
    const res = await pool.query(
      "SELECT f.surname, COUNT(fm.member_id) AS member_count, f.admin_id, u.name AS admin_name FROM families f LEFT JOIN family_members fm ON f.id = fm.family_id LEFT JOIN users u on f.admin_id = u.id WHERE f.id = $1 GROUP BY f.id, u.name;",
      [familyId],
    );

    const response: FamilyInterface = {
      adminId: +res.rows[0].admin_id,
      adminName: res.rows[0].admin_name,
      id: familyId,
      memberCount: +res.rows[0].member_count,
      surname: res.rows[0].surname,
    };

    return response;
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
});

export const inviteNewMember = cache(
  async (familyId: number, formData: FormData) => {
    // XXX TODO XXX
    // rate limiting & input validation
    try {
      const email = formData.get("email") as string;
      let userId = 0;
      if (email) {
        // first check for the existence of a user with the provided email
        userId = await getUserIdFromEmail(email);
      }
      // next check their status in the family & for a pending invite
      const userIsFamilyMember = await checkIfUserIsFamilyMember(
        familyId,
        userId,
      );
      const invitedQuery = await pool.query(
        "SELECT EXISTS(SELECT 1 FROM invites WHERE user_id = $1 AND family_id = $2)",
        [userId, familyId],
      );
      const alreadyInvited = invitedQuery.rows[0].exists;
      if (userId && !userIsFamilyMember && !alreadyInvited) {
        // invite the user if they exist, are not in the family and have not
        // already been invited

        // note: for security reasons, we aren't informing the inviting admin
        // if the email provided is legit or not.
        await pool.query(
          "INSERT INTO invites (user_id, family_id, created_at) VALUES ($1, $2, NOW())",
          [userId, familyId],
        );
      }
      revalidatePath("/");
      return;
    } catch (err) {
      // XXX TODO XXX
      // log this
      throw err;
    }
  },
);

export const joinFamily = cache(async (familyId: number) => {
  const client = await pool.connect();
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Cannot join family - no session");
    }
    const { user } = session;
    if (!user || !user.id) {
      throw new Error("Cannot join family - no user or missing id");
    }
    const userId = +user.id;
    const invitedQuery = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM invites WHERE user_id = $1 AND family_id = $2)",
      [userId, familyId],
    );
    const invited = invitedQuery.rows[0].exists;
    if (invited) {
      // first check if the user was invited to join the family
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO family_members (family_id, member_id) VALUES ($1, $2)",
        [familyId, userId],
      );
      await client.query(
        "DELETE FROM invites WHERE user_id = $1 AND family_id = $2",
        [userId, familyId],
      );
      await client.query("COMMIT");
      revalidatePath("/");
      revalidatePath("/families/all");
      revalidatePath(`/families/${familyId}`);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
    // XXX TODO XXX
    // log this
  } finally {
    client.release();
  }
});

export const removeInvite = async (familyId: number) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Cannot decline invite - no session");
    }
    const { user } = session;
    if (!user || !user.id) {
      throw new Error("Cannot decline invite - no user or missing id");
    }
    const userId = +user.id;
    await pool.query(
      "DELETE FROM invites WHERE user_id = $1 AND family_id = $2",
      [userId, familyId],
    );
    revalidatePath("/");
  } catch (err) {
    throw err;
    // XXX TODO XXX
    // log this
  }
};
