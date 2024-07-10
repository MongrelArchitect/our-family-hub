export default async function FamilyInfo({
  family,
}: {
  family: {
    adminId: number;
    adminName: string;
    memberCount: number;
    surname: string;
  };
}) {
  return (
    <div className="flex flex-col bg-slate-100 shadow-md shadow-slate-500">
      <h2 className="bg-emerald-100 p-2 text-2xl">{family.surname} Family</h2>
      <div className="p-2">
        <div>Members: {family.memberCount}</div>
        <div>Admin: {family.adminName}</div>
      </div>
    </div>
  );
}
