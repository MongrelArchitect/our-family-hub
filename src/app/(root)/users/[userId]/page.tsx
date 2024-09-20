import { Metadata } from "next";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";

import profileIcon from "@/assets/icons/account-circle.svg";

import Card from "@/components/Card";
import Loading from "@/components/Loading";
import LocalTime from "@/components/LocalTime";
import ProfileImage from "@/components/ProfileImage";

import getUserId from "@/lib/auth/user";
import { getOtherUsersInfo } from "@/lib/db/users";

import UserInterface from "@/types/Users";

interface Props {
  params: {
    userId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  let memberName = "User Profile";
  try {
    const userInfo = await getOtherUsersInfo(+params.userId);
    if (userInfo) {
      memberName = userInfo.name;
    }
  } catch {
    memberName = "User Profile";
  }

  return {
    title: memberName,
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
    <Card
      borderColor="border-green-400"
      flair={<Image alt="" className="p-2" src={profileIcon} width={48} />}
      heading="User Profile"
      headingColor="bg-green-200"
    >
      <div className="flex flex-wrap items-center gap-4">
        {userInfo ? (
          <>
            <ProfileImage size={96} userId={userInfo.id} />
            <div>
              <p>{userInfo.name}</p>
              <p className="break-all text-base">{userInfo.email}</p>
              <div className="flex flex-wrap text-base">
                Joined:{" "}
                <LocalTime dateOnly timestampFromServer={userInfo.createdAt} />
              </div>
              <div className="flex flex-wrap text-base">
                Last login:{" "}
                <LocalTime
                  dateOnly
                  timestampFromServer={userInfo.lastLoginAt}
                />
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </Card>
  );
}
