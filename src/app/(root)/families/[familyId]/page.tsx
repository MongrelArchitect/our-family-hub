import { Metadata } from "next";

import Card from "@/components/Card";
import { getFamilyInfo, getFamilySurname } from "@/lib/db/families";

export async function generateMetadata({
  params,
}: {
  params: { familyId: string };
}): Promise<Metadata> {
  const familyId = +params.familyId;
  let familyName = "My Family";
  try {
    const surname = await getFamilySurname(familyId);
    familyName = `The ${surname} Family`;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error getting family surname for page title: ", err);
  }

  return {
    title: familyName,
  };
}

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  const family = await getFamilyInfo(familyId);

  return (
    <main className="flex flex-col p-2 text-lg">
      <Card
        heading={`The ${family.surname} Family`}
        headingColor="bg-emerald-200"
      >
        <div>Members: {family.memberCount}</div>
        <div>Admin: {family.adminName}</div>
      </Card>
    </main>
  );
}
