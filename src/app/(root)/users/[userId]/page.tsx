import Image from "next/image";
import { redirect, notFound } from "next/navigation";

import profileIcon from "@/assets/icons/account-circle.svg";
import Card from "@/components/Card";
import LocalTime from "@/components/LocalTime";
import getUserId from "@/lib/auth/user";
import { getOtherUsersInfo } from "@/lib/db/users";
import UserInterface from "@/types/Users";

interface Props {
  params: {
    userId: string;
  };
}

export default async function UserProfile({ params }: Props) {
  const usersOwnId = await getUserId();
  const profileUserId = +params.userId;

  if (usersOwnId === profileUserId) {
    redirect("/users/me");
  }

  let userInfo: UserInterface | null = null;

  try {
    // throws an error if no users are found, either because they don't exist or
    // they don't share a family in common with the user making the request
    userInfo = await getOtherUsersInfo(profileUserId);
  } catch (err) {
    notFound();
  }

  return (
    <main className="p-2 text-lg">
      <Card
        flair={<Image alt="" src={profileIcon} />}
        heading="User Profile"
        headingColor="bg-emerald-200"
      >
        <div className="flex flex-wrap items-center gap-4">
          <img
            alt=""
            className="max-h-[96px] max-w-[96px] flex-1 rounded-full"
            src={userInfo.image}
          />
          <div>
            <p>{userInfo.name}</p>
            <p className="break-all text-base">{userInfo.email}</p>
            <div className="flex flex-wrap text-base">
              Joined:{" "}
              <LocalTime dateOnly timestampFromServer={userInfo.createdAt} />
            </div>
            <div className="flex flex-wrap text-base">
              Last login:{" "}
              <LocalTime dateOnly timestampFromServer={userInfo.lastLoginAt} />
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
