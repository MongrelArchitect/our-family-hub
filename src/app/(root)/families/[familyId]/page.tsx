import { Metadata } from "next";

import { getFamilySurname } from "@/lib/db/families";

import { getFamilyInfo } from "@/lib/db/families";

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
      <div className="flex flex-col bg-slate-100 shadow-md shadow-slate-500">
        <h2 className="bg-emerald-100 p-2 text-2xl">{family.surname} Family</h2>
        <div className="p-2">
          <div>Members: {family.memberCount}</div>
          <div>Admin: {family.adminName}</div>
        </div>
      </div>
    </main>
  );
}
