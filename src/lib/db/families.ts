"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { isEmail, isEmpty, isLength, trim } from "validator";

import { addNewFamilyImage } from "../images/images";
import getUserId from "@/lib/auth/user";
import generateError from "../errors/errors";
import pool from "./pool";

import FamilyInterface from "@/types/Families";
import UserInterface from "@/types/Users";

export async function createNewFamily(
  imageName: string,
  formData: FormData,
): Promise<number> {
  const client = await pool.connect();
  const userId = await getUserId();
  try {
    let surname = formData.get("surname");
    if (!surname || typeof surname !== "string") {
      throw new Error("Missing or invalid surname");
    }

    surname = trim(surname);

    if (isEmpty(surname)) {
      throw new Error("Surname required");
    }

    if (!isLength(surname, { min: 1, max: 255 })) {
      throw new Error("255 characters max");
    }

    await client.query("BEGIN");
    // create the family with user as admin
    const familyQuery = `
      INSERT INTO families (admin_id, surname) 
      VALUES ($1, $2) 
      RETURNING id
    `;
    const familyResult = await client.query(familyQuery, [userId, surname]);
    const familyId: number = familyResult.rows[0].id;
    // now that we have the id, handle the family image
    await addNewFamilyImage(imageName, familyId, formData, surname, userId);
    // also add them to the junction table tracking family members
    const memberQuery = `
      INSERT INTO family_members (family_id, member_id) 
      VALUES ($1, $2)
    `;
    await client.query(memberQuery, [familyId, userId]);

    await client.query("COMMIT");
    revalidatePath("/families/all");
    // return the id of the newly created family, for redirecting to its page
    return familyId;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "createNewFamily",
          "Error creating new family",
          userId,
        ),
      ),
    );
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export const checkIfUserIsAdmin = cache(async (familyId: number) => {
  const userId = await getUserId();
  try {
    const query = `
      SELECT 1
      FROM families
      WHERE admin_id = $1
      AND id = $2
    `;
    const result = await pool.query(query, [userId, familyId]);
    return result.rowCount ? true : false;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "checkIfUserIsAdmin",
          `Error checking if user is admin of familiy with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
});

export const checkIfUserIsFamilyMember = cache(
  async (familyId: number): Promise<boolean> => {
    const userId = await getUserId();
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
      console.error(
        JSON.stringify(
          generateError(
            err,
            "checkIfUserIsFamilyMember",
            `Error checking if user is member of familiy with id ${familyId}`,
            userId,
          ),
        ),
      );
      throw err;
    }
  },
);

export const checkIfUserCanViewImage = cache(async (familyId: number) => {
  const userId = await getUserId();
  try {
    const query = `
        WITH member_check AS (
          SELECT 1
          FROM family_members
          WHERE member_id = $1
          AND family_id = $2
        ),
        invite_check AS (
          SELECT 1
          FROM invites
          WHERE user_id = $1
          AND family_id = $2
        )
        SELECT 1
        WHERE EXISTS (SELECT 1 FROM member_check)
        OR EXISTS (SELECT 1 FROM invite_check)
      `;
    const result = await pool.query(query, [userId, familyId]);
    return result.rowCount ? true : false;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "checkIfUserCanViewImage",
          `Error checking if user can view image of familiy with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
});

export async function deleteFamily(familyId: number) {
  const userId = await getUserId();
  const client = await pool.connect();
  try {
    await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
    // first check if the user making this request is the family admin
    const adminCheck = `
      SELECT 1
      FROM families
      WHERE admin_id = $1
      AND id = $2
    `;
    const adminCheckResult = await client.query(adminCheck, [userId, familyId]);
    const isAdmin = adminCheckResult.rowCount ? true : false;
    if (!isAdmin) {
      throw new Error("User is not family admin");
    }

    // now start deleting content - first, todo list tasks
    const tasksQuery = `
      DELETE FROM tasks
      WHERE todo_list_id IN (
        SELECT id
        FROM todo_lists
        WHERE family_id = $1
      )
    `;
    await client.query(tasksQuery, [familyId]);

    // now delete all the todo lists themselves
    const todoQuery = `
      DELETE FROM todo_lists
      WHERE family_id = $1
    `;
    await client.query(todoQuery, [familyId]);

    // next comes discussion thread posts
    const postsQuery = `
      DELETE FROM posts 
      WHERE thread_id IN (
        SELECT id
        FROM threads
        WHERE family_id = $1
      )
    `;
    await client.query(postsQuery, [familyId]);

    // now the threads themselves
    const threadsQuery = `
      DELETE FROM threads
      WHERE family_id = $1
    `;
    await client.query(threadsQuery, [familyId]);

    // delete calendar events
    const eventsQuery = `
      DELETE FROM events
      WHERE family_id = $1
    `;
    await client.query(eventsQuery, [familyId]);

    // now get rid of any pending invites
    const invitesQuery = `
      DELETE FROM invites 
      WHERE family_id = $1
    `;
    await client.query(invitesQuery, [familyId]);

    // remove the family members
    const membersQuery = `
      DELETE FROM family_members 
      WHERE family_id = $1
    `;
    await client.query(membersQuery, [familyId]);

    // finally get rid of the family itself
    const familyQuery = `
      DELETE FROM families
      WHERE id = $1
    `;
    await client.query(familyQuery, [familyId]);

    // everything's good to go - commit the transaction
    await client.query("COMMIT");
    revalidatePath("/");
    revalidatePath(`/families/${familyId}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      JSON.stringify(
        generateError(
          err,
          "deleteFamily",
          `Error deleting familiy with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function editFamilySurname(familyId: number, formData: FormData) {
  const userId = await getUserId();
  try {
    let surname = formData.get("surname");
    if (!surname || typeof surname !== "string") {
      throw new Error("Missing or invalid surname");
    }

    surname = trim(surname);

    if (isEmpty(surname)) {
      throw new Error("Surname required");
    }

    if (!isLength(surname, { min: 1, max: 255 })) {
      throw new Error("255 characters max");
    }

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
    console.error(
      JSON.stringify(
        generateError(
          err,
          "editFamilySurname",
          `Error editing surname of familiy with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
}

export const getAllAdminFamilies = cache(async () => {
  const userId = await getUserId();
  try {
    const query = `
      SELECT 
        f.id AS family_id, 
        f.surname, 
        fm.member_count AS member_count, 
        f.admin_id
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
      WHERE f.admin_id = $1
      ORDER BY f.surname
    `;

    const response = await pool.query(query, [userId]);

    const families: FamilyInterface[] = [];

    response.rows.forEach((row) => {
      const family: FamilyInterface = {
        adminId: row.admin_id,
        adminName: "You",
        id: row.family_id,
        memberCount: +row.member_count,
        surname: row.surname,
      };
      families.push(family);
    });

    return families;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "getAllAdminFamilies",
          "Error getting all families that user is admin of",
          userId,
        ),
      ),
    );
    throw err;
  }
});

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
      ORDER BY f.admin_id = $1 desc, f.surname
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
    console.error(
      JSON.stringify(
        generateError(
          err,
          "getAllUsersFamilies",
          "Error getting all families that user is member of",
          userId,
        ),
      ),
    );
    throw err;
  }
});

export const getFamilyMembers = cache(async (familyId: number) => {
  const userId = await getUserId();
  try {
    // query is restricted to family members only - hence the AND EXISTS...
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
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
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
      };
      members.push(member);
    });
    return members;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "getFamilyMembers",
          `Error getting members of family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
});

export const getFamilySurname = cache(async (familyId: number) => {
  // XXX TODO XXX
  // 1) do we need this? getFamilyInfo gets surname & we can rely on cache...
  // 2) if so, protect this so only family members can get the info
  const userId = await getUserId();
  try {
    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
      SELECT surname
      FROM families
      WHERE id = $2
      AND EXISTS(SELECT 1 FROM member_check)
    `;
    const res = await pool.query(query, [userId, familyId]);
    return res.rows[0].surname as string;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "getFamilySurname",
          `Error getting surname of family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
});

export const getFamilyInfo = cache(async (familyId: number) => {
  const userId = await getUserId();
  try {
    const query = `
      WITH member_check AS (
        SELECT 1
        FROM family_members
        WHERE member_id = $1
        AND family_id = $2
      )
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
      WHERE f.id = $2 
      AND EXISTS(SELECT 1 FROM member_check)
      GROUP BY f.id, u.name
    `;
    const res = await pool.query(query, [userId, familyId]);

    const response: FamilyInterface = {
      adminId: +res.rows[0].admin_id,
      adminName: res.rows[0].admin_name,
      id: familyId,
      memberCount: +res.rows[0].member_count,
      surname: res.rows[0].surname,
    };

    return response;
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "getFamilyInfo",
          `Error getting info of family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
});

export const inviteNewMember = cache(
  async (familyId: number, formData: FormData) => {
    const authUserId = await getUserId();
    let email = formData.get("email");
    try {
      if (!email || typeof email !== "string") {
        throw new Error("Missing or invalid email");
      }

      email = trim(email);

      if (isEmpty(email)) {
        throw new Error("Email required");
      }

      if (!isEmail(email)) {
        throw new Error("Invalid email");
      }
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
      console.error(
        JSON.stringify(
          generateError(
            err,
            "inviteNewMember",
            `Error inviting user with email ${email} to family with id ${familyId}`,
            authUserId,
          ),
        ),
      );
      throw err;
    }
  },
);

export const joinFamily = cache(async (familyId: number) => {
  const userId = await getUserId();
  const client = await pool.connect();
  try {
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
      revalidatePath(`/families/${familyId}/members`);
      revalidatePath(`/families/${familyId}/remove`);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      JSON.stringify(
        generateError(
          err,
          "joinFamily",
          `Error joining family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  } finally {
    client.release();
  }
});

export const removeInvite = async (familyId: number) => {
  const userId = await getUserId();
  try {
    await pool.query(
      "DELETE FROM invites WHERE user_id = $1 AND family_id = $2",
      [userId, familyId],
    );
    revalidatePath("/");
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "removeInvite",
          `Error removing invite from family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
};

export async function removeMember(familyId: number, memberId: number) {
  const userId = await getUserId();
  const client = await pool.connect();
  try {
    await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
    // first check if the user making this request is the family admin
    const adminCheck = `
      SELECT 1
      FROM families
      WHERE admin_id = $1
      AND id = $2
    `;
    const adminCheckResult = await client.query(adminCheck, [userId, familyId]);
    const isAdmin = adminCheckResult.rowCount ? true : false;
    if (!isAdmin) {
      throw new Error("User is not family admin");
    }

    if (userId === memberId) {
      throw new Error("Admin cannot remove themselves from the family");
    }

    // before the member can be removed, all of their content for this family
    // must be reassiged to the "Former Member" user (id 1)

    // starting with tasks
    const tasksQuery = `
      UPDATE tasks
      SET created_by = 1
      WHERE created_by = $1
      AND todo_list_id
      IN (
        SELECT id
        FROM todo_lists
        WHERE family_id = $2
      )
    `;
    await client.query(tasksQuery, [memberId, familyId]);

    // then todo lists
    const todosQuery = `
      UPDATE todo_lists 
      SET created_by = 1
      WHERE created_by = $1
      AND family_id = $2
    `;
    await client.query(todosQuery, [memberId, familyId]);

    // now thread posts
    const postsQuery = `
      UPDATE posts
      SET author_id = 1
      WHERE author_id = $1
      AND thread_id
      IN (
        SELECT id
        FROM threads
        WHERE family_id = $2
      )
    `;
    await client.query(postsQuery, [memberId, familyId]);

    // then threads themselves
    const threadsQuery = `
      UPDATE threads 
      SET author_id = 1
      WHERE author_id = $1
      AND family_id = $2
    `;
    await client.query(threadsQuery, [memberId, familyId]);

    // then calendar events
    const eventsQuery = `
      UPDATE events
      SET created_by = 1
      WHERE created_by = $1
      AND family_id = $2
    `;
    await client.query(eventsQuery, [memberId, familyId]);

    // finally, remove the member from the family
    const removeQuery = `
      DELETE
      FROM family_members fm
      WHERE fm.family_id = $1 
      AND fm.member_id = $2
    `;

    await client.query(removeQuery, [familyId, memberId]);
    await client.query("COMMIT");
    revalidatePath("/families/all");
    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/remove`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      JSON.stringify(
        generateError(
          err,
          "removeMember",
          `Error removing member with id ${memberId} from family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function transferAdminStatus(familyId: number, memberId: number) {
  const userId = await getUserId();
  try {
    const query = `
      WITH admin_check AS (
        SELECT 1
        FROM families
        WHERE id = $1
        AND admin_id = $2
      ) 
      UPDATE families
      SET admin_id = $3
      WHERE id = $1
      AND EXISTS (SELECT 1 FROM admin_check)
    `;
    const result = await pool.query(query, [familyId, userId, memberId]);
    if (!result.rowCount) {
      throw new Error("Error transferring admin role");
    }
    revalidatePath("/");
    revalidatePath("/users/me");
    revalidatePath(`/families/${familyId}`);
    revalidatePath(`/families/${familyId}/members`);
    revalidatePath(`/families/${familyId}/promote`);
    revalidatePath(`/families/${familyId}/remove`);
  } catch (err) {
    console.error(
      JSON.stringify(
        generateError(
          err,
          "transferAdminStatus",
          `Error promoting member with id ${memberId} to admin of family with id ${familyId}`,
          userId,
        ),
      ),
    );
    throw err;
  }
}
