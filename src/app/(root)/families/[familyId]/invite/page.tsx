import InviteForm from "./InviteForm";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return <InviteForm familyId={familyId} />;
}
