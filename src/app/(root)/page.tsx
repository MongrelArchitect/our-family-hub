import { getUsersInvites, getUsersOwnInfo } from "@/lib/db/users";
import { getFamilyInfo } from "@/lib/db/families";

import Card from "@/components/Card";
import Invite from "./Invite";

export default async function Home() {
  const user = await getUsersOwnInfo();
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
      <Card 
        borderColor="border-lime-400"
        heading="Pending Invites" headingColor="bg-lime-200">
        {showInvites()}
      </Card>
    </main>
  );
}
