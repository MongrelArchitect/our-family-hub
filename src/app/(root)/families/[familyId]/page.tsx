import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { checkIfUserIsFamilyMember, getMemberCount, getSurname } from "@/lib/db/families";

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId  = +params.familyId;
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

  const userIsFamilyMember = await checkIfUserIsFamilyMember(familyId, +user.id)

  if (!userIsFamilyMember) {
  return (
    <main className="p-2">
      <h2 className="text-2xl">Not Family Member</h2>
      <p>Only family members can veiw this page</p>
    </main>
  );
  }

  const [memberCount, surname] = await Promise.all([
    getMemberCount(familyId),
    getSurname(familyId),
  ]);

  return (
    <main className="p-2">
      <h2 className="text-2xl">{surname} Family</h2>
      <div>{memberCount} member{memberCount === 1 ? "" : "s"}</div>
    </main>
  );
}
