import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";

import { checkIfUserIsFamilyMember, getFamilyInfo } from "@/lib/db/families";

import Controls from "./components/controls";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { familyId: string };
}>) {
  const familyId = +params.familyId;
  if (isNaN(familyId)) {
    notFound();
  }

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    // middleware handles this, but typescript yells at us so ¯\_(ツ)_/¯
    return null;
  }

  const { user } = session;
  if (!user.id) {
    // we'll have this added during sign-in, but typescript doesn't know that
    return null;
  }

  // this will also return false if no such family exists with the given id
  const userIsFamilyMember = await checkIfUserIsFamilyMember(
    familyId,
    +user.id,
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
      <Controls familyId={familyId} userIsAdmin={+user.id === family.adminId} />
    </>
  );
}
