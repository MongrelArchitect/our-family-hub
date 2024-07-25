import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/auth/user";
import NewFamilyForm from "./NewFamilyForm";

export default async function NewFamily() {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }

  return (
    <main className="p-2">
      <NewFamilyForm />
    </main>
  );
}
