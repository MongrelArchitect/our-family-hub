import PromoteForm from "./PromoteForm";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return <PromoteForm familyId={familyId} />;
}
