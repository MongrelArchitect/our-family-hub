import { Metadata } from "next";
import { getUsersOwnInfo } from "@/lib/db/users";
import Image from "next/image";
import profileIcon from "@/assets/icons/account-circle.svg";
import LocalTime from "@/components/LocalTime";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function MyProfile() {
  const userInfo = await getUsersOwnInfo();
  console.log(userInfo);

  return (
    <main className="p-2 text-lg">
      <Card
        flair={<Image alt="" src={profileIcon} />}
        heading="My Profile"
        headingColor="bg-emerald-200"
      >
        <div className="flex flex-wrap gap-4">
          <img
            alt=""
            className="max-h-[96px] max-w-[96px] flex-1 rounded-full"
            src={userInfo.image}
          />
          <div>
            <p>{userInfo.name}</p>
            <p className="break-all">{userInfo.email}</p>
            <div className="flex flex-wrap">
              Joined:{" "}
              <LocalTime dateOnly timestampFromServer={userInfo.createdAt} />
            </div>
            <div className="flex flex-wrap">
              Last login:{" "}
              <LocalTime dateOnly timestampFromServer={userInfo.lastLoginAt} />
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
