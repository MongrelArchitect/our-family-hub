"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import pool from "./pool";

import FamilyInterface from "@/types/Families";
import UserInterface from "@/types/Users";

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
    const familyQuery = `
      INSERT INTO families (admin_id, surname) 
      VALUES ($1, $2) 
      RETURNING id
    `;
    const familyResult = await client.query(familyQuery, [+user.id, surname]);
    const familyId: number = familyResult.rows[0].id;
    // also add them to the junction table tracking family members
    const memberQuery = `
      INSERT INTO family_members (family_id, member_id) 
      VALUES ($1, $2)
    `;
    await client.query(memberQuery, [familyId, +user.id]);
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
      const query = `
        SELECT EXISTS(
          SELECT 1 FROM family_members 
          WHERE family_id = $1 
          AND member_id = $2
        )
      `;
      const res = await pool.query(query, [familyId, userId]);
      const exists: boolean = res.rows[0].exists;
      return exists;
    } catch (err) {
      // XXX TODO XXX
      // log this
      throw err;
    }
  },
);

export async function editFamilySurname(familyId: number, formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Error editing family - missing session");
    }
    const { user } = session;
    if (!user.id) {
      throw new Error("Error editing family - missing user id");
    }
    const surname = formData.get("surname");
    if (!surname) {
      throw new Error("Error editing family - missing surname");
    }
    const userId = +user.id;

    const query = `
      WITH admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $1
        AND admin_id = $2
      ) 
      UPDATE families
      SET surname = $3
      WHERE id = $1
      AND EXISTS (SELECT 1 FROM admin_check)
    `;

    const result = await pool.query(query, [familyId, userId, surname]);
    if (result.rowCount) {
      revalidatePath("/");
      revalidatePath("/families/all");
      revalidatePath(`/families/${familyId}`);
      revalidatePath(`/families/${familyId}/edit`);
      revalidatePath(`/families/${familyId}/invite`);
      revalidatePath(`/families/${familyId}/remove`);
    } else {
      throw new Error("Error editing family - enure admin status");
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    throw err;
  }
}

export const getAllUsersFamilies = cache(async (userId: number) => {
  try {
    const query = `
      SELECT 
        f.id AS family_id, 
        f.surname, 
        fm.member_count AS member_count, 
        f.admin_id, 
        u.name AS admin_name 
      FROM families 
      AS f 
      LEFT JOIN (
        SELECT family_id, 
        COUNT(member_id) AS member_count 
        FROM family_members 
        GROUP BY family_id
      ) 
      AS fm 
      ON f.id = fm.family_id 
      LEFT JOIN users 
      AS u 
      ON f.admin_id = u.id 
      WHERE EXISTS (
        SELECT 1 
        FROM family_members 
        WHERE family_id = f.id 
        AND member_id = $1
      ) 
      ORDER BY f.surname
  `;
    const res = await pool.query(query, [userId]);

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

export const getFamilyMembers = cache(async (familyId: number) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Error getting family members - missing session");
    }
    const { user } = session;
    if (!user.id) {
      throw new Error("Error getting family members - missing user id");
    }
    const userId = +user.id;

    // query is restricted to family members only - hence the AND EXISTS...
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.image, 
        u.created_at, 
        u.last_login_at 
      FROM users AS u 
      JOIN family_members AS fm 
      ON u.id = fm.member_id 
      WHERE fm.family_id = $1 
      AND EXISTS(
        SELECT 1 
        FROM family_members 
        WHERE family_id = $1 
        AND member_id = $2
      ) 
      ORDER BY u.name
    `;
    const result = await pool.query(query, [familyId, userId]);
    const members: UserInterface[] = [];
    result.rows.forEach((row) => {
      const member: UserInterface = {
        id: row.id,
        name: row.name,
        email: row.email,
        image: row.image,
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
      };
      members.push(member);
    });
    return members;
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
    const query = `
      SELECT 
        f.surname, 
        COUNT(fm.member_id) AS member_count, 
        f.admin_id, 
        u.name AS admin_name 
      FROM families AS f 
      LEFT JOIN family_members AS fm 
      ON f.id = fm.family_id 
      LEFT JOIN users AS u 
      ON f.admin_id = u.id 
      WHERE f.id = $1 
      GROUP BY f.id, u.name
    `;
    const res = await pool.query(query, [familyId]);

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
      const session = await auth();
      if (!session) {
        throw new Error("Cannot invite user - no session");
      }
      const { user } = session;
      if (!user || !user.id) {
        throw new Error("Cannot invite user - no auth user or missing id");
      }
      const authUserId = +user.id;
      const email = formData.get("email") as string;
      // invite the user if they exist, are not in the family, have not already
      // been invited and if the user making the invite is the family admin

      // note: for security reasons, we aren't informing the inviting admin
      // if the email provided is legit or not.
      const query = `
        WITH user_id AS (
          SELECT id
          FROM users
          WHERE email = $1
        ),
        member_check AS (
          SELECT 1
          FROM family_members
          WHERE member_id = (SELECT id FROM user_id)
          AND family_id = $2
        ),
        invite_check AS (
          SELECT 1
          FROM invites
          WHERE user_id = (SELECT id FROM user_id)
          AND family_id = $2
        ),
        admin_check AS (
          SELECT 1
          FROM families
          WHERE id = $2
          AND admin_id = $3
        )
        INSERT INTO invites (user_id, family_id)
        SELECT (SELECT id FROM user_id), $2
        WHERE EXISTS (SELECT id FROM user_id)
        AND NOT EXISTS (SELECT 1 FROM member_check)
        AND NOT EXISTS (SELECT 1 FROM invite_check)
        AND EXISTS (SELECT 1 FROM admin_check)
      `;
      const result = await pool.query(query, [email, familyId, authUserId]);
      if (result.rowCount) {
        // this will be 1 if the insert is successful, 0 if not
        revalidatePath("/");
      }
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
      const insert = await client.query(
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
      revalidatePath(`/families/${familyId}/remove`);
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

export async function removeMember(familyId: number, memberId: number) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("Error removing member - missing session");
    }
    const { user } = session;
    if (!user.id) {
      throw new Error("Error removing member - missing user id");
    }
    const userId = +user.id;

    const query = `
      DELETE
      FROM family_members fm
      WHERE fm.family_id = $1 
      AND fm.member_id = $2
      AND fm.member_id <> $3
      AND EXISTS(
        SELECT 1
        FROM families f
        WHERE f.id = $1
        AND f.admin_id = $3
      )
    `;

    await pool.query(query, [familyId, memberId, userId]);
    revalidatePath("/families/all");
    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/remove`);
  } catch (err) {
    throw err;
    // XXX TODO XXX
    // log this
  }
}
