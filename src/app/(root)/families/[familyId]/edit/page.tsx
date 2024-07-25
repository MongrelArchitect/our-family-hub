import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/auth/user";

import EditForm from "./EditForm";

export default async function EditFamily({
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
      <EditForm familyId={familyId} />
    </main>
  );
}
