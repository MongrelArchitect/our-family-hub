import { redirect } from "next/navigation";
import { getUsersInvites } from "@/lib/db/users";
import { getFamilyInfo } from "@/lib/db/families";

import Card from "@/components/Card";
import { getUserInfo } from "@/lib/auth/user";
import Invite from "./Invite";

export default async function Home() {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }

  const invites = await getUsersInvites(user.id);

  const showInvites = () => {
    if (invites.length) {
      return (
        <ul className="flex flex-col gap-4">
          {invites.map(async (invite) => {
            const familyInfo = await getFamilyInfo(invite.familyId);
            return (
              <Invite
                familyInfo={familyInfo}
                invite={invite}
                key={invite.familyId}
              />
            );
          })}
        </ul>
      );
    }
    return (
      <p className="p-2 text-lg">No invites available. Check back later!</p>
    );
  };

  return (
    <main className="flex flex-col gap-2 p-2 text-xl">
      <h2 className="text-2xl">Welcome {user.name || ""}!</h2>
      <Card heading="Pending Invites" headingColor="bg-emerald-200">
        {showInvites()}
      </Card>
    </main>
  );
}
