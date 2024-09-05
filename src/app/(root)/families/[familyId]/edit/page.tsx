import EditForm from "./EditForm";

export default async function EditFamily({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  return <EditForm familyId={familyId} />;
}
