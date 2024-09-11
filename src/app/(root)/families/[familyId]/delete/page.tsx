import Image from "next/image";
import Link from "next/link";

import deleteIcon from "@/assets/icons/trash-can.svg";

import Card from "@/components/Card";
import { getFamilyInfo } from "@/lib/db/families";

import DeleteForm from "./DeleteForm";
import Loading from "@/components/Loading";

export default async function Invite({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  const familyInfo = await getFamilyInfo(familyId);
  if (!familyInfo) {
    return (
      <Card
        borderColor="border-rose-400"
        flair={<Image alt="" className="p-2" src={deleteIcon} width={48} />}
        headingColor="bg-rose-200"
        heading="Delete Family"
      >
        <h3 className="text-lg font-bold text-red-700">Confirm Delete</h3>
        <Loading />
      </Card>
    );
  }

  return (
    <Card
      borderColor="border-rose-400"
      flair={<Image alt="" className="p-2" src={deleteIcon} width={48} />}
      headingColor="bg-rose-200"
      heading="Delete Family"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-red-700">Confirm Delete</h3>
        <p>
          Please confirm that you would like to delete{" "}
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href={`/families/${familyId}`}
          >
            The {familyInfo.surname} Family
          </Link>
          .
        </p>
        <p>
          All content within The {familyInfo.surname} Family will be deleted
          along with the family itself. This is permanent and{" "}
          <b>cannot be undone</b>.
        </p>
        <DeleteForm familyId={familyId} surname={familyInfo.surname} />
      </div>
    </Card>
  );
}
