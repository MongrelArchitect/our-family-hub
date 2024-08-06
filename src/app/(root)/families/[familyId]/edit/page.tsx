import EditForm from "./EditForm";

export default async function EditFamily({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return (
    <main className="flex flex-col p-2">
      <EditForm familyId={familyId} />
    </main>
  );
}
