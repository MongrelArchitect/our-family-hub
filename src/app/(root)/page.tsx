import { Josefin_Sans } from "next/font/google";
import Image from "next/image";

import familiesIcon from "@/assets/icons/home-group.svg";
import inviteIcon from "@/assets/icons/account-group.svg";

import AllFamilies from "./AllFamilies";
import Card from "@/components/Card";
import CurrentUserImage from "./UserImage";
import Invite from "./Invite";

import { getUsersInvites, getUsersOwnInfo } from "@/lib/db/users";
import { getFamilyInfo } from "@/lib/db/families";

const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap" });

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
      <p className="p-2 text-lg">No invites available yet. Check back later!</p>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-[auto_1fr]">
      <div className="col-start-1 col-end-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-t-4 border-neutral-400 bg-slate-100 p-2 shadow-md shadow-slate-500">
        <h2
          className={`${josefin.className} flex flex-wrap items-center justify-between rounded-2xl bg-neutral-100 text-2xl font-semibold`}
        >
          {user.name || ""}
        </h2>
        <CurrentUserImage size={48} userId={user.id} />
      </div>

      <Card
        borderColor="border-emerald-400"
        flair={<Image alt="" className="p-2" src={familiesIcon} width={48} />}
        heading="My Families"
        headingColor="bg-emerald-200"
      >
        <AllFamilies />
      </Card>

      <Card
        borderColor="border-purple-400"
        flair={<Image alt="" className="p-2" src={inviteIcon} width={48} />}
        heading="Pending Invites"
        headingColor="bg-purple-200"
      >
        {showInvites()}
      </Card>
    </div>
  );
}
