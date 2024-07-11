import { getFamilyInfo } from "@/lib/db/families";

import FamilyInfo from "../components/familyInfo";

import FamilyInterface from "@/types/families";

export default async function Invite({ params }: {params: {familyId: string}}) {
  const familyId = +params.familyId;

  let family: FamilyInterface | undefined = undefined;

  try {
    family = await getFamilyInfo(familyId);
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error gettin family surname for invite form: ", err);
  }

  if (!family) {
    return null;
  }

  return (
    <main className="p-2">
      <FamilyInfo family={family} />
      <form>
        <h2>Invite</h2>
      </form>
    </main>
  );
}
