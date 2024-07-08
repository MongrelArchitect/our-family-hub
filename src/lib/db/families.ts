"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import pool from "./pool";

import FamilyInterface from "@/types/families";

export async function createNewFamily(
  surname: string,
): Promise<number> {
  const client = await pool.connect();
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Cannot create family - no session");
    }
    const { user } = session;
    if (!user || !user.id) {
      throw new Error("Cannot create family - no user or invalid id");
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
  } finally {
    client.release();
  }
}

export async function checkIfFamilyExists(familyId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM families WHERE id = $1)",
      [familyId],
    );
    const exists: boolean = res.rows[0].exists;
    return exists;
  } catch (err) {
    throw err;
  }
}

export async function checkIfUserIsFamilyMember(
  familyId: number,
  userId: number,
): Promise<boolean> {
  try {
    const res = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM family_members WHERE family_id = $1 AND member_id = $2)",
      [familyId, userId],
    );
    const exists: boolean = res.rows[0].exists;
    return exists;
  } catch (err) {
    throw err;
  }
}

export async function getAllUsersFamilies(userId: number) {
  try {
    const res = await pool.query(
      "SELECT f.id AS family_id, f.surname, fm.member_count AS member_count FROM families f LEFT JOIN (SELECT family_id, COUNT(member_id) AS member_count FROM family_members GROUP BY family_id) fm ON f.id = fm.family_id WHERE EXISTS (SELECT 1 FROM family_members WHERE family_id = f.id AND member_id = $1) ORDER BY f.surname",
      [userId],
    );

    const response: FamilyInterface[] = [];

    res.rows.forEach((row) => {
      const family: FamilyInterface = {
        id: row.family_id,
        surname: row.surname,
        memberCount: +row.member_count,
      };
      response.push(family);
    });

    return response;
  } catch (err) {
    throw err;
  }
}

export async function getMemberCount(familyId: number): Promise<number> {
  try {
    const res = await pool.query(
      "SELECT COUNT(*) FROM family_members WHERE family_id = $1",
      [familyId],
    );
    const count: number = +res.rows[0].count;
    return count;
  } catch (err) {
    throw err;
  }
}

export async function getSurname(familyId: number): Promise<string> {
  try {
    const res = await pool.query("SELECT surname FROM families WHERE id = $1", [
      familyId,
    ]);
    const surname: string = res.rows[0].surname;
    return surname;
  } catch (err) {
    throw err;
  }
}
