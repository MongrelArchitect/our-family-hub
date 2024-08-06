import RemoveForm from "./RemoveForm";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return (
    <main className="flex flex-col p-2">
      <RemoveForm familyId={familyId} />
    </main>
  );
}
