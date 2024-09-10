import { Metadata } from "next";
import Image from "next/image";

import profileIcon from "@/assets/icons/account-circle.svg";

import Card from "@/components/Card";
import DeleteAccount from "./DeleteAccount";
import EditImageForm from "./EditImage";
import EditNameForm from "./EditName";
import LocalTime from "@/components/LocalTime";

import { getUsersOwnInfo } from "@/lib/db/users";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function MyProfile() {
  const userInfo = await getUsersOwnInfo();

  return (
    <Card
      borderColor="border-green-400"
      flair={<Image alt="" className="p-2" src={profileIcon} width={48} />}
      heading="My Profile"
      headingColor="bg-green-200"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <EditImageForm userId={userInfo.id} />
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
        <DeleteAccount />
      </div>
    </Card>
  );
}
