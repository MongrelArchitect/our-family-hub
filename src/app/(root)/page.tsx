import { auth } from "@/auth";
import { getUsersInvites } from "@/lib/db/users";
import { getFamilyInfo } from "@/lib/db/families";

import Card from "@/components/Card";
import Invite from "@/components/Invite";

export default async function Home() {
  // ===================================
  // middleware handles redirect for non-auth users
  // this is to make typescript happy ¯\_(ツ)_/¯
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const { user } = session;
  if (!user.id) {
    return null;
  }
  // ===================================
  const userId = +user.id;
  const invites = await getUsersInvites(userId);

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
