import pg from "pg";

import { UserInterface } from "@/types/user";

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
  port: DATABASE_PORT ? +DATABASE_PORT : undefined,
});

client.connect().catch(err => console.error('Connection error', err.stack));

process.on('exit', () => {
  client.end().catch(err => console.error('Disconnection error', err.stack));
});

const checkPg = async () => {
  const res = await client.query(`SELECT * FROM users`);
  return res.rows as UserInterface[];
};

export default async function DbTest() {
  const users = await checkPg();
  return (
    <main className="min-h-screen bg-teal-100">
      {users.map((user) => {
        return <div key={user.id}>{user.name}</div>;
      })}
    </main>
  );
}
