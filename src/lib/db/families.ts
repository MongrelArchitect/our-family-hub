import pool from "./pool";

export async function createNewFamily(
  surname: string,
  userId: number,
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const familyResult = await client.query(
      `INSERT INTO families (admin_id, surname) VALUES (${userId}, '${surname}') RETURNING id`,
    );
    const familyId: number = familyResult.rows[0].id;
    await client.query(
      `INSERT INTO family_members (family_id, member_id) VALUES (${familyId}, ${userId})`,
    );
    await client.query("COMMIT");
    return familyId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
