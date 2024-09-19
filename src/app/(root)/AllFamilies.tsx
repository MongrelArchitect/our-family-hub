import Image from "next/image";
import Link from "next/link";

import starIcon from "@/assets/icons/star.svg";
import homeIcon from "@/assets/icons/home.svg";

import FamilyImage from "@/components/FamilyImage";

import getUserId from "@/lib/auth/user";
import { getAllUsersFamilies } from "@/lib/db/families";

import FamilyInterface from "@/types/Families";

export default async function AllFamilies() {
  const userId = await getUserId();

  let families: FamilyInterface[] = [];
  try {
    families = await getAllUsersFamilies(userId);
  } catch (err) {
    console.error("Error getting user's families: ", err);
    return (
      <div className="text-red-700">Error getting user&apos;s families</div>
    );
  }

  if (families.length) {
    return (
      <ul className="flex flex-col gap-4">
        {families.map((family) => {
          const userIsAdmin = userId === family.adminId;
          return (
            <li
              className="border-2 border-slate-500 p-2"
              key={`family-${family.id}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Link
                    className="font-bold text-violet-800 hover:underline focus:underline"
                    href={`/families/${family.id}`}
                    title={`${family.surname} family`}
                  >
                    {`The ${family.surname} Family`}
                  </Link>
                  <div>
                    <p className="text-base">
                      <span>Members: </span>
                      <span className="font-mono">{family.memberCount}</span>
                    </p>
                    <p className="text-base">
                      Admin: {userIsAdmin ? "You" : family.adminName}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <FamilyImage familyId={family.id} size={96} />
                  <Image
                    alt=""
                    className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow shadow-slate-600"
                    src={userIsAdmin ? starIcon : homeIcon}
                    width={32}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="p-2 text-lg">
      Not a member of any families.{" "}
      <Link
        className="font-bold text-violet-800 hover:underline focus:underline"
        href="/families/new"
      >
        Create a new family
      </Link>{" "}
      to get started.
    </div>
  );
}
