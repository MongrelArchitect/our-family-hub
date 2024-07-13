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

export default async function Invite({ params }: {params: {familyId: string}}) {
  const familyId = +params.familyId;

  return (
    <main className="p-2 flex flex-col gap-4">
      <form
        className="flex flex-col gap-4 bg-slate-100 text-lg shadow-md shadow-slate-500"
      >
        <h2 className="bg-amber-200 p-2 text-2xl">Invite New Member</h2>
      </form>
    </main>
  );
}
