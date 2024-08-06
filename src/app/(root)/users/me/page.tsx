import { Metadata } from "next";
import { getUsersOwnInfo } from "@/lib/db/users";
import Image from "next/image";
import profileIcon from "@/assets/icons/account-circle.svg";
import EditNameForm from "./EditName";
import LocalTime from "@/components/LocalTime";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function MyProfile() {
  const userInfo = await getUsersOwnInfo();

  return (
    <main className="p-2 text-lg">
      <Card
        flair={<Image alt="" src={profileIcon} />}
        heading="My Profile"
        headingColor="bg-emerald-200"
      >
        <div className="flex gap-4 flex-wrap">
          <img
            alt=""
            className="max-h-[96px] max-w-[96px] flex-1 rounded-full"
            src={userInfo.image}
          />
          <div>
            <EditNameForm name={userInfo.name} />
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
