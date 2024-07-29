import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/auth/user";
import NewThreadForm from "./NewThreadForm";

export const metadata: Metadata = {
  title: "New Thread",
};

export default async function NewTodolist({
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
    <main className="p-2">
      <NewThreadForm familyId={familyId} />
    </main>
  );
}
