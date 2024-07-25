import { Metadata } from "next";
import { redirect } from "next/navigation";

import { checkIfUserIsFamilyMember, getFamilyInfo } from "@/lib/db/families";
import { getUserInfo } from "@/lib/auth/user";

import Controls from "./Controls";

export async function generateMetadata({
  params,
}: {
  params: { familyId: string };
}): Promise<Metadata> {
  const familyId = +params.familyId;
  let familyName = "My Family";
  try {
    const { surname } = await getFamilyInfo(familyId);
    familyName = `The ${surname} Family`;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error getting family surname for page title: ", err);
  }

  return {
    title: {
      template: `Our Family Hub | ${familyName} | %s`,
      default: familyName,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { familyId: string };
}>) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }
  const userId = user.id;

  const familyId = +params.familyId;

  // this will also return false if no such family exists with the given id
  const userIsFamilyMember = await checkIfUserIsFamilyMember(
    familyId,
    userId
  );

  if (!userIsFamilyMember) {
    // don't divulge family existence - just inform about membership requirement
    return (
      <main className="p-2">
        <h2 className="text-2xl">Not Family Member</h2>
        <p>Only family members can veiw this page</p>
      </main>
    );
  }

  const family = await getFamilyInfo(familyId);

  return (
    <>
      {children}
      <Controls familyId={familyId} userIsAdmin={userId === family.adminId} />
    </>
  );
}
