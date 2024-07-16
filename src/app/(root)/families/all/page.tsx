import { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import Card from "@/components/Card";
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
              <li key={family.id}>
                <Link
                  className="outline-emerald-700 hover:outline focus:outline"
                  href={`/families/${family.id}`}
                  title={`${family.surname} family`}
                >
                  <Card
                    heading={`The ${family.surname} Family`}
                    headingColor="bg-emerald-200"
                  >
                    <p>
                      <span>Members: </span>
                      <span className="font-mono">{family.memberCount}</span>
                    </p>
                  </Card>
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
      <h2 className="text-center text-2xl">My Families</h2>
      {displayFamilies()}
    </main>
  );
}
