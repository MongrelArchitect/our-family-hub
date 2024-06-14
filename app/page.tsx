import pg from "pg";

interface User {
  id: number;
  name: string;
  email: string;
}

const checkPg = async () => {
  const { Client } = pg;
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: "our-family-hub-database-dev-1",
    database: process.env.POSTGRES_DB,
    port: 5432,
  });
  await client.connect();
  const res = await client.query(`SELECT * FROM users`);
  await client.end();
  return res.rows as User[];
};

export default async function Home() {
  const users = await checkPg();
  return (
    <main className="min-h-screen bg-teal-100">
      {users.map((user) => {
        return <div key={user.id}>{user.name}</div>;
      })}
    </main>
  );
}
