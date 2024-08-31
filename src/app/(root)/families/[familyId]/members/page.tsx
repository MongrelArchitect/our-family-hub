import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import starIcon from "@/assets/icons/star.svg";
import membersIcon from "@/assets/icons/account-group.svg";

import Card from "@/components/Card";
import ProfileImage from "@/components/ProfileImage";

import { getFamilyInfo, getFamilyMembers } from "@/lib/db/families";

export const metadata: Metadata = {
  title: "All Members",
};

interface Props {
  params: {
    familyId: string;
  };
}

export default async function FamilyMembers({ params }: Props) {
  const familyId = +params.familyId;

  const familyInfo = await getFamilyInfo(familyId);
  const familyMembers = await getFamilyMembers(familyId);

  return (
    <main className="p-2 text-lg">
      <Card
        borderColor="border-green-400"
        flair={<Image alt="" className="p-2" src={membersIcon} width={48} />}
        heading={`${familyInfo.surname} Family Members`}
        headingColor="bg-green-200"
      >
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            <li className="flex flex-wrap items-center justify-between gap-2 bg-stone-300 p-2">
              <Link
                className="flex flex-wrap items-center gap-2 font-bold text-violet-800 hover:underline focus:underline"
                href={`/users/${familyInfo.adminId}`}
                title={`View ${familyInfo.adminName}'s profile`}
              >
                <ProfileImage
                  reloadTrigger={false}
                  size={64}
                  userId={familyInfo.adminId}
                />
                {familyInfo.adminName}
              </Link>
              <div className="flex flex-col items-center font-mono text-sm">
                <Image alt="" src={starIcon} width={24} />
                ADMIN
              </div>
            </li>
            {familyMembers.map((member, index) => {
              if (member.id === familyInfo.adminId) {
                return null;
              }
              return (
                <li
                  className={`${index % 2 === 0 ? "bg-stone-300" : "bg-stone-200"} p-2 flex flex-wrap justify-start`}
                  key={`member-${member.id}`}
                >
                  <Link
                    className="flex flex-wrap items-center gap-2 font-bold text-violet-800 hover:underline focus:underline"
                    href={`/users/${member.id}`}
                    title={`View ${member.name}'s profile`}
                  >
                    <ProfileImage
                      reloadTrigger={false}
                      size={64}
                      userId={member.id}
                    />
                    {member.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href={`/families/${familyId}`}
          >{`Back to The ${familyInfo.surname} Family`}</Link>
        </div>
      </Card>
    </main>
  );
}
