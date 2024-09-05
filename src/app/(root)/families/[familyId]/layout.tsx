import { Metadata } from "next";
import { notFound } from "next/navigation";

import { checkIfUserIsFamilyMember, getFamilyInfo } from "@/lib/db/families";
import getUserId from "@/lib/auth/user";

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
  const userId = await getUserId();

  const familyId = +params.familyId;

  // this will also return false if no such family exists with the given id
  const userIsFamilyMember = await checkIfUserIsFamilyMember(familyId, userId);

  if (!userIsFamilyMember) {
    // don't divulge family existence - just 404
    notFound();
  }

  return children;
}
