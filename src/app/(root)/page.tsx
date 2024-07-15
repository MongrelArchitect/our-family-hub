import { auth } from "@/auth";
import { getUsersInvites } from "@/lib/db/users";
import { getFamilyInfo } from "@/lib/db/families";

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

  const invites = await getUsersInvites(+user.id);

  const showInvites = () => {
    if (invites.length) {
      return (
        <ul className="p-2 flex flex-col gap-2">
          {invites.map(async (invite) => {
            const familyInfo = await getFamilyInfo(invite.familyId);
            return (
              <li
                className="border-2 border-slate-500 p-2"
                key={invite.familyId}
              >
                <div className="font-bold">
                  {`The ${familyInfo.surname} Family`}
                </div>
                <div className="text-base">
                  <div>
                    Members:{" "}
                    <span className="font-mono">{familyInfo.memberCount}</span>
                  </div>
                  <div>
                    Invited by:{" "}
                    <span className="font-mono">{familyInfo.adminName}</span>
                  </div>
                </div>
                <div className="flex gap-2 text-lg flex-wrap">
                  <button className="flex-grow bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300">
                    Accept
                  </button>
                  <button className="flex-grow bg-rose-200 p-2 hover:bg-rose-300 focus:bg-rose-300">
                    Decline
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      );
    }
    return <p>None</p>;
  };

  return (
    <main className="flex flex-col gap-2 p-2 text-xl">
      <h2 className="text-2xl">Welcome {user.name || ""}!</h2>
      <div className="bg-neutral-100 shadow-md shadow-slate-500">
        <h2 className="bg-emerald-200 p-2 text-2xl">Pending Invites</h2>
        {showInvites()}
      </div>
    </main>
  );
}
