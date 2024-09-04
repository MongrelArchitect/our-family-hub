import RemoveForm from "./RemoveForm";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return <RemoveForm familyId={familyId} />;
}
