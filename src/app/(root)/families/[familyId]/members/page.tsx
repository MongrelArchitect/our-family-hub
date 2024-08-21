import { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import { getFamilyInfo, getFamilyMembers } from "@/lib/db/families";
import ProfileImage from "@/components/ProfileImage";

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
        heading={`${familyInfo.surname} Family Members`}
        headingColor="bg-emerald-200"
      >
        <ul className="flex flex-col gap-2">
          <li className="bg-stone-200 p-2">
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
          </li>
          {familyMembers.map((member, index) => {
            if (member.id === familyInfo.adminId) {
              return null;
            }
            return (
              <li
                className={`${index % 2 === 0 ? "bg-stone-300" : "bg-stone-200"} p-2`}
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
      </Card>
    </main>
  );
}
