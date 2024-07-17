import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import starIcon from "@/assets/icons/star.svg";
import Card from "@/components/Card";
import { getAllUsersFamilies } from "@/lib/db/families";

export const metadata: Metadata = {
  title: "My Families",
};

export default async function Families() {
  // ===================================
  // middleware handles redirect for non-auth users
  // this is to make typescript happy ¯\_(ツ)_/¯
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const { user } = session;
  if (!user.id) {
    return null;
  }
  // ===================================

  const userId = +user.id;
  const families = await getAllUsersFamilies(userId);

  const displayFamilies = () => {
    if (families.length) {
      return (
        <ul className="flex flex-col gap-4">
          {families.map((family) => {
            const userIsAdmin = userId === family.adminId;
            return (
              <li key={family.id}>
                <Link
                  className="outline-emerald-700 hover:outline focus:outline"
                  href={`/families/${family.id}`}
                  title={`${family.surname} family`}
                >
                  <Card
                    flair={
                      userIsAdmin ? (
                        <Image alt="admin" src={starIcon} title="admin" />
                      ) : null
                    }
                    heading={`The ${family.surname} Family`}
                    headingColor="bg-emerald-200"
                  >
                    <p>
                      <span>Members: </span>
                      <span className="font-mono">{family.memberCount}</span>
                    </p>
                    <p>Admin: {userIsAdmin ? "You" : family.adminName}</p>
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
