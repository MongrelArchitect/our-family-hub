export default function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const { familyId } = params;
  return (
    <div>
      FAMILY PAGE
      <div>ID: {familyId}</div>
    </div>
  );
}
