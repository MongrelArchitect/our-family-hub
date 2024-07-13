import { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { getAllUsersFamilies } from "@/lib/db/families";

export const metadata: Metadata = {
  title: "My Families",
};

export default async function Families() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const { user } = session;

  if (!user || !user.id) {
    return null;
  }

  const families = await getAllUsersFamilies(+user.id);

  const displayFamilies = () => {
    if (families.length) {
      return (
        <ul className="flex flex-col gap-4">
          {families.map((family) => {
            return (
              <li
                className="flex flex-col bg-slate-100 shadow-md shadow-slate-400"
                key={family.id}
              >
                <Link
                  className="p-1 hover:bg-slate-200 focus:bg-slate-200"
                  href={`/families/${family.id}`}
                  title={`${family.surname} family`}
                >
                  <h3 className="text-xl font-bold">{family.surname}</h3>
                  <p>
                    <span>Members: </span>
                    <span className="font-mono">{family.memberCount}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      );
    }
    return <div>Not a member of any families</div>;
  };

  return (
    <main className="flex flex-col gap-4 p-2">
      <h2 className="text-2xl">My Families</h2>
      {displayFamilies()}
    </main>
  );
}
