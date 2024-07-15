import { Metadata } from "next";

import { getFamilySurname } from "@/lib/db/families";

export async function generateMetadata({
  params,
}: {
  params: { familyId: string };
}): Promise<Metadata> {
  const familyId = +params.familyId;
  let familyName = "My Family";
  try {
    const surname = await getFamilySurname(familyId);
    familyName = `The ${surname} Family`;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error getting family surname for page title: ", err);
  }

  return {
    title: `${familyName} | Invite New Member`,
  };
}

export default function InviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
