"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import promoteIcon from "@/assets/icons/account-tie.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Loading from "@/components/Loading";
import ProfileImage from "@/components/ProfileImage";

import {
  getFamilyInfo,
  getFamilyMembers,
  transferAdminStatus,
} from "@/lib/db/families";

import FamilyInterface from "@/types/Families";
import UserInterface from "@/types/Users";

interface Props {
  familyId: number;
}

export default function PromoteForm({ familyId }: Props) {
  const [error, setError] = useState<null | string>(null);
  const [confirming, setConfirming] = useState(false);
  const [promotionSuccess, setPromotionSuccess] = useState(false);
  const [familyInfo, setFamilyInfo] = useState<FamilyInterface | null>(null);
  const [familyMembers, setFamilyMembers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<UserInterface | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        setLoading(true);
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
        <div className="flex flex-wrap items-start gap-2">
          <ProfileImage size={128} userId={memberInfo.id} />
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

  const submitForm = async () => {
    if (memberInfo?.id) {
      try {
        setError(null);
        setLoading(true);
        await transferAdminStatus(familyId, memberInfo.id);
        setPromotionSuccess(true);
      } catch (err) {
        setConfirming(false);
        console.error("Error transferring admin role: ", err);
        setError("Error transferring admin role");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Missing member id");
    }
  };

  const toggleConfirm = () => {
    setConfirming(!confirming);
  };

  const showForm = () => {
    if (familyMembers.length === 1) {
      // in this case the admin is the only user, so there's nobody to promote
      return (
        <>
          <p>
            You are the only member of{" "}
            <b>The {familyInfo?.surname || null} Family</b>. There are no other
            members who can become admin.
          </p>
          <p>
            <Link
              className="font-bold text-violet-900 hover:underline focus:underline"
              href={`/families/${familyId}/invite`}
            >
              Send some invites
            </Link>{" "}
            to grow your family!
          </p>
        </>
      );
    }
    if (promotionSuccess) {
      return (
        <>
          <p>
            <b>{memberInfo?.name || "Member"}</b> has been successfully promoted
            to admin of <b>The {familyInfo?.surname || null} Family</b>.
          </p>
        </>
      );
    }
    return (
      <>
        {memberInfo || memberLoading ? null : (
          <p>
            Choose a family member to view their information and confirm their
            status as the new admin of <b>The {familyInfo?.surname} Family</b>.
          </p>
        )}
        {showMemberInfo()}

        <label htmlFor="members">Member to promote:</label>
        <select
          className="border-2 border-neutral-600 bg-neutral-100 p-2 hover:outline hover:outline-slate-600 focus:outline focus:outline-slate-600"
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

        {confirming ? (
          <div className="flex flex-col gap-2">
            <p className="text-red-700">
              Are you sure you want to transfer admin status to{" "}
              <b>{memberInfo?.name || "them"}</b>? You will no longer be admin
              of <b>The {familyInfo?.surname || null} Family</b>!
            </p>

            <Button style="cancel" onClick={toggleConfirm} type="button">
              CANCEL
            </Button>

            <Button style="submit" type="submit">
              TRANSFER
            </Button>
          </div>
        ) : (
          <Button
            disabled={memberInfo ? false : true}
            onClick={memberInfo ? toggleConfirm : undefined}
            style="submit"
            type="button"
          >
            CONFIRM
          </Button>
        )}
      </>
    );
  };

  return (
    <form action={submitForm} className="text-lg" noValidate>
      <Card
        borderColor="border-emerald-400"
        flair={<Image alt="" className="p-2" src={promoteIcon} width={48} />}
        heading="Transfer Admin Role"
        headingColor="bg-emerald-200"
      >
        {loading ? (
          <div className="p-2 pb-4">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {showForm()}
            <Link
              className="font-bold text-violet-900 hover:underline focus:underline"
              href={`/families/${familyId}`}
            >{`Back to The ${familyInfo?.surname || ""} Family`}</Link>
          </div>
        )}
      </Card>
    </form>
  );
}
