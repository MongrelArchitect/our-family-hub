import pool from "./pool";

export async function createNewFamily(
  surname: string,
  userId: number,
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // create the family with user as admin
    const familyResult = await client.query(
      `INSERT INTO families (admin_id, surname) VALUES (${userId}, '${surname}') RETURNING id`,
    );
    const familyId: number = familyResult.rows[0].id;
    // also add them to the junction table tracking family members
    await client.query(
      `INSERT INTO family_members (family_id, member_id) VALUES (${familyId}, ${userId})`,
    );
    await client.query("COMMIT");
    // return the id of the newly created family, for redirecting to its page
    return familyId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
