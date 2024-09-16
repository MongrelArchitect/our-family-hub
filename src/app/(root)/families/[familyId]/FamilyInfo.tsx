"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import deleteIcon from "@/assets/icons/trash-can.svg";
import editIcon from "@/assets/icons/home-edit.svg";
import familyIcon from "@/assets/icons/home.svg";
import inviteIcon from "@/assets/icons/account-plus.svg";
import promoteIcon from "@/assets/icons/account-tie.svg";
import removeIcon from "@/assets/icons/account-cancel.svg";
import starIcon from "@/assets/icons/star.svg";

import Card from "@/components/Card";
import FamilyImage from "@/components/FamilyImage";

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
        className={`${controlsVisible ? "max-h-[300px]" : "max-h-0"} flex flex-wrap items-start justify-start gap-4 overflow-hidden transition-[max-height] duration-500`}
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
          aria-label="Transfer admin role to another member"
          className="rounded-full border-2 border-orange-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${family.id}/promote`}
          tabIndex={controlsVisible ? 0 : -1}
          title="Transfer admin role to another member"
        >
          <Image alt="" className="p-2" src={promoteIcon} width={48} />
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
        <Link
          aria-label="Delete family"
          className="rounded-full border-2 border-orange-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${family.id}/delete`}
          tabIndex={controlsVisible ? 0 : -1}
          title="Delete family"
        >
          <Image alt="" className="p-2" src={deleteIcon} width={48} />
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
            title={`${controlsVisible ? "Close" : "Open"} admin controls`}
            type="button"
          >
            <Image alt="" className="p-2" src={starIcon} width={40} />
          </button>
        ) : (
          <Image alt="" className="p-2" src={familyIcon} width={48} />
        )
      }
      heading={`The ${family.surname} Family`}
      headingColor={userIsAdmin ? "bg-emerald-200" : "bg-emerald-200"}
    >
      <div className="flex flex-col gap-2">
        {userIsAdmin ? showAdminControls() : null}
        <div className="flex items-start gap-2">
          <FamilyImage familyId={family.id} size={192} />
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
          </div>
        </div>
      </div>
    </Card>
  );
}
