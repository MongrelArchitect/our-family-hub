import InviteForm from "./InviteForm";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return (
    <main className="flex flex-col p-2">
      <InviteForm familyId={familyId} />
    </main>
  );
}
