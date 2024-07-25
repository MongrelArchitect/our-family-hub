import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/auth/user";
import RemoveForm from "./RemoveForm";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }
  const familyId = +params.familyId;
  return (
    <main className="flex flex-col p-2">
      <RemoveForm familyId={familyId} />
    </main>
  );
}
