import { getMemberCount, getSurname } from "@/lib/db/families";

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId  = +params.familyId;
  const memberCount = await getMemberCount(familyId);
  const surname = await getSurname(familyId);

  return (
    <main className="p-2">
      <h2 className="text-2xl">{surname} Family</h2>
      <div>{memberCount} member{memberCount === 1 ? "" : "s"}</div>
    </main>
  );
}
