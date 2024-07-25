import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import starIcon from "@/assets/icons/star.svg";
import Card from "@/components/Card";
import { getAllUsersFamilies } from "@/lib/db/families";
import { getUserInfo } from "@/lib/auth/user";
import FamilyInterface from "@/types/Families";

export const metadata: Metadata = {
  title: "My Families",
};

export default async function Families() {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }
  
  let families: FamilyInterface[] = [];
  try {
    families = await getAllUsersFamilies(user.id);
  } catch (err) {
    console.error("Error getting user's families: ", err);
    return (
      <main>
        <div className="text-red-700">
          Error getting user's families
        </div>
      </main>
    );
  }

  const displayFamilies = () => {
    if (families.length) {
      return (
        <ul className="flex flex-col gap-4">
          {families.map((family) => {
            const userIsAdmin = user.id === family.adminId;
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
