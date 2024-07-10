import { redirect } from "next/navigation";

import { auth } from "@/auth";

import Controls from "./components/controls";
import FamilyInfo from "./components/familyInfo";

import { checkIfUserIsFamilyMember, getFamilyInfo } from "@/lib/db/families";

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  if (isNaN(familyId)) {
    return null;
  }

  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }

  const { user } = session;
  if (!user.id) {
    // XXX weird edge case, wat do here?
    return null;
  }

  const userIsFamilyMember = await checkIfUserIsFamilyMember(
    familyId,
    +user.id,
  );

  if (!userIsFamilyMember) {
    return (
      <main className="p-2">
        <h2 className="text-2xl">Not Family Member</h2>
        <p>Only family members can veiw this page</p>
      </main>
    );
  }

  const family = await getFamilyInfo(familyId);

  return (
    <main className="flex flex-col p-2 text-lg">
      <FamilyInfo family={family} />
      <Controls userIsAdmin = {+user.id === family.adminId} />
    </main>
  );
}
