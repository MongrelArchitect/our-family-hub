import pg from "pg";

const { Pool } = pg;

const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
} = process.env;

const pool = new Pool({
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  database: DATABASE_NAME,
  port: DATABASE_PORT ? +DATABASE_PORT : 5432,
});

process.on("exit", () => {
  pool.end().catch((err) => console.error("Disconnection error", err.stack));
});

export default pool;
