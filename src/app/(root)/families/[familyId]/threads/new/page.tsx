import { Metadata } from "next";

import NewThreadForm from "./NewThreadForm";

export const metadata: Metadata = {
  title: "New Thread",
};

export default async function NewTodolist({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return (
    <main className="p-2">
      <NewThreadForm familyId={familyId} />
    </main>
  );
}
