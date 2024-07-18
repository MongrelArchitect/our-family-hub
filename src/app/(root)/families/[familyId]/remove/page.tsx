"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Card from "@/components/Card";
import Loading from "@/components/Loading";
import { getFamilyInfo, getFamilyMembers } from "@/lib/db/families";
import FamilyInterface from "@/types/families";
import { UserInterface } from "@/types/user";

export default function Invite({ params }: { params: { familyId: string } }) {
  const familyId = +params.familyId;

  const [error, setError] = useState<null | string>(null);
  const [familyInfo, setFamilyInfo] = useState<FamilyInterface | null>(null);
  const [familyMembers, setFamilyMembers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<UserInterface | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        setFamilyInfo(await getFamilyInfo(familyId));
        setFamilyMembers(await getFamilyMembers(familyId));
        setLoading(false);
      } catch (err) {
        console.error("Error getting family info: ", err);
        setError("Error getting family info");
      }
    };
    loadInfo();
  }, []);

  const showMemberInfo = () => {
    if (memberLoading) {
      return <Loading />;
    }
    if (memberInfo) {
      return (
        <div className="flex flex-wrap gap-2">
          <img
            alt=""
            className="max-h-[64px] max-w-[64px] rounded-full"
            src={memberInfo.image}
          />
          <div className="break-all">
            <p>{memberInfo.name}</p>
            <p>{memberInfo.email}</p>
            <p>{`Member since ${memberInfo.createdAt.toLocaleDateString()}`}</p>
            <p>{`Last login ${memberInfo.lastLoginAt.toLocaleDateString()}`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getMemberInfo = async (event: React.SyntheticEvent) => {
    console.log(familyMembers);
    const target = event.target as HTMLSelectElement;
    const targetId = +target.value;
    setMemberLoading(true);
    const memberToShow = familyMembers.find((member) => {
      return member.id === targetId;
    });
    if (memberToShow) {
      setMemberInfo(memberToShow);
    }
    setMemberLoading(false);
  };

  const submitForm = () => {};

  return (
    <main className="flex flex-col p-2">
      <form action={submitForm} className="text-lg" noValidate>
        <Card heading="Remove Member" headingColor="bg-amber-200">
          {loading ? (
            <div className="p-2 pb-4">
              <Loading />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {memberInfo || memberLoading ? null : (
                <p>
                  Choose a family member you&apos;d like to remove from{" "}
                  {`The ${familyInfo?.surname || ""} Family`} to view their
                  information and confirm their removal from the family.
                </p>
              )}
              {showMemberInfo()}

              <label htmlFor="members">Member to remove:</label>
              <select
                className="bg-indigo-200 p-2"
                defaultValue={0}
                name="members"
                onChange={getMemberInfo}
                id="members"
              >
                <option value={0} disabled>
                  Choose a member
                </option>
                {familyMembers.map((member) => {
                  if (member.id !== familyInfo?.adminId) {
                    return (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>

              {error ? <div className="text-red-700">{error}</div> : null}
              <button
                className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                type="submit"
              >
                Submit
              </button>
              <Link
                className="font-bold text-violet-900 hover:underline focus:underline"
                href={`/families/${familyId}`}
              >{`Back to The ${familyInfo?.surname || ""} Family`}</Link>
            </div>
          )}
        </Card>
      </form>
    </main>
  );
}
