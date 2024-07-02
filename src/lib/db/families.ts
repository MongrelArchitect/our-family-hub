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
      "INSERT INTO families (admin_id, surname) VALUES ($1, $2) RETURNING id",
      [userId, surname],
    );
    const familyId: number = familyResult.rows[0].id;
    // also add them to the junction table tracking family members
    await client.query(
      "INSERT INTO family_members (family_id, member_id) VALUES ($1, $2)",
      [familyId, userId],
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

export async function checkIfFamilyExists(familyId: number):Promise<boolean> {
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
    const res = await pool.query(
      "SELECT surname FROM families WHERE id = $1",
      [familyId],
    );
    const surname: string = res.rows[0].surname;
    return surname;
  } catch (err) {
    throw err;
  }
}
