import pg from "pg";

const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
} = process.env;

const { Client } = pg;

const client = new Client({
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  database: DATABASE_NAME,
  port: DATABASE_PORT ? +DATABASE_PORT : 5432,
});

client.connect().catch((err) => console.error("Connection error", err.stack));

process.on("exit", () => {
  client.end().catch((err) => console.error("Disconnection error", err.stack));
});

export async function addUserToDatabase(user: {
  // return the id of the newly created user
  name: string;
  email: string;
  image: string;
}): Promise<number> {
  try {
    const result = await client.query(
      `INSERT INTO users (name, email, image) VALUES ('${user.name}', '${user.email}', '${user.image}') RETURNING id`,
    );
    return result.rows[0].id;
  } catch (err) {
    console.error("Error adding new user: ", err);
    throw new Error("Error adding new user");
  }
}

export async function getUserIdFromEmail(email: string): Promise<number> {
  // will return user id if they exist, or 0 if not
  try {
    const result = await client.query(
      `SELECT id FROM users WHERE email = '${email}'`
    );
    if (result.rows.length) {
      return result.rows[0].id;
    }
    return 0;
  } catch (err) {
    console.error("Error checking for existing user: ", err);
    throw new Error("Error checking for existing user");
  }
}

export async function updateUserLoginTimestamp(email: string) {
  try {
    const result = await client.query(
      `UPDATE users SET last_login_at = NOW() WHERE email = '${email}'`,
    );
    return result;
  } catch (err) {
    console.error("Error updating user's login timestamp: ", err);
    throw new Error("Error updating user's login timestamp");
  }
}
