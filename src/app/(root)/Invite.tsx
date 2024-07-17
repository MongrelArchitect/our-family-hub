"use client";
import { useEffect, useState } from "react";

import Loading from "@/components/Loading";

import { joinFamily, removeInvite } from "@/lib/db/families";

import FamilyInterface from "@/types/families";
import InviteInterface from "@/types/invites";

interface Props {
  familyInfo: FamilyInterface;
  invite: InviteInterface;
}

export default function Invite({ familyInfo, invite }: Props) {
  const joinFamilyWithInfo = joinFamily.bind(null, invite.familyId);
  const removeInviteWithInfo = removeInvite.bind(null, invite.familyId);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState("Some time");

  useEffect(() => {
    setTimestamp(invite.createdAt.toLocaleDateString());
    setLoading(false);
  }, []);

  const acceptInvite = async () => {
    try {
      setLoading(true);
      await joinFamilyWithInfo();
      setLoading(false);
    } catch (err) {
      setError("Error joining family");
      console.error("Error joining family: ", err);
    }
  };

  const declineInvite = async () => {
    try {
      setLoading(true);
      await removeInviteWithInfo();
      setLoading(false);
    } catch (err) {
      setError("Error declining invite");
      console.error("Error declining invite: ", err);
    }
  };

  return (
    <li className="border-2 border-slate-500 p-2">
      <div className="font-bold">{`The ${familyInfo.surname} Family`}</div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="text-base">
            <div>
              Members:{" "}
              <span className="font-mono">{familyInfo.memberCount}</span>
            </div>
            <div>{`Invited by ${familyInfo.adminName} on ${timestamp}`}</div>
          </div>
          {error ? (
            <div className="text-base font-bold text-red-700">{error}</div>
          ) : null}
          <div className="flex flex-wrap gap-2 text-lg">
            <button
              className="flex-grow bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
              onClick={acceptInvite}
              type="button"
            >
              Accept
            </button>
            <button
              className="flex-grow bg-rose-200 p-2 hover:bg-rose-300 focus:bg-rose-300"
              onClick={declineInvite}
              type="button"
            >
              Decline
            </button>
          </div>
        </>
      )}
    </li>
  );
}
