"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import editIcon from "@/assets/icons/home-edit.svg";
import inviteIcon from "@/assets/icons/account-plus.svg";
import removeIcon from "@/assets/icons/account-cancel.svg";
import starIcon from "@/assets/icons/star.svg";

import Card from "@/components/Card";

import FamilyInterface from "@/types/Families";

interface Props {
  family: FamilyInterface;
  userId: number;
  userIsAdmin: boolean;
}

export default function FamilyInfo({ family, userId, userIsAdmin }: Props) {
  const [controlsVisible, setControlsVisible] = useState(false);

  const toggleControlsVisible = () => {
    setControlsVisible(!controlsVisible);
  };

  const showAdminControls = () => {
    return (
      <div
        aria-label="Admin controls"
        aria-hidden={!controlsVisible}
        id="admin-controls"
        className={`${controlsVisible ? "max-h-[300px]" : "max-h-0"} flex flex-wrap items-start justify-start gap-6 overflow-hidden transition-[max-height] duration-500`}
      >
        <Link
          aria-label="Invite new member to family"
          className="rounded-full border-2 border-orange-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${family.id}/invite`}
          tabIndex={controlsVisible ? 0 : -1}
          title="Invite new member to family"
        >
          <Image alt="" className="p-2" src={inviteIcon} width={48} />
        </Link>
        <Link
          aria-label="Remove member from family"
          className="rounded-full border-2 border-orange-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${family.id}/remove`}
          tabIndex={controlsVisible ? 0 : -1}
          title="Remove member from family"
        >
          <Image alt="" className="p-2" src={removeIcon} width={48} />
        </Link>
        <Link
          aria-label="Edit family info"
          className="rounded-full border-2 border-orange-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${family.id}/edit`}
          tabIndex={controlsVisible ? 0 : -1}
          title="Edit family info"
        >
          <Image alt="" className="p-2" src={editIcon} width={48} />
        </Link>
      </div>
    );
  };

  return (
    <Card
      borderColor="border-emerald-400"
      flair={
        userIsAdmin ? (
          <button
            aria-controls="admin-controls"
            aria-expanded={controlsVisible ? "true" : "false"}
            className="rounded-full border-2 border-orange-400 bg-neutral-100 hover:bg-amber-300 focus:bg-amber-300"
            onClick={toggleControlsVisible}
            title="Open admin controls"
            type="button"
          >
            <Image alt="" className="p-2" src={starIcon} width={40} />
          </button>
        ) : null
      }
      heading={`The ${family.surname} Family`}
      headingColor={userIsAdmin ? "bg-emerald-200" : "bg-emerald-200"}
    >
      <div className="flex flex-col gap-2">
        <p>
          <span>Members: </span>
          <span className="font-mono">
            <Link
              className="font-bold text-violet-800 hover:underline focus:underline"
              href={`/families/${family.id}/members`}
              title="View members"
            >
              {family.memberCount}
            </Link>
          </span>
        </p>
        <p>
          Admin:{" "}
          {userIsAdmin ? (
            <Link
              className="font-bold text-violet-800 hover:underline focus:underline"
              href={`/users/${userId}`}
              title="View your profile"
            >
              You
            </Link>
          ) : (
            <Link
              className="font-bold text-violet-800 hover:underline focus:underline"
              href={`/users/${family.adminId}`}
              title={`View ${family.adminName}'s profile`}
            >
              {family.adminName}
            </Link>
          )}
        </p>
        {userIsAdmin ? showAdminControls() : null}
      </div>
    </Card>
  );
}
