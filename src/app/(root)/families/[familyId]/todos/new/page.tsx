import { Metadata } from "next";

import NewTodoListForm from "./NewTodoListForm";

export const metadata: Metadata = {
  title: "New Todo List",
};

export default async function NewTodolist({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return <NewTodoListForm familyId={familyId} />;
}
