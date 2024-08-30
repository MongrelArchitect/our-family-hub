"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import inviteIcon from "@/assets/icons/account-plus.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { getFamilySurname, inviteNewMember } from "@/lib/db/families";

interface Props {
  familyId: number;
}

export default function InviteForm({ familyId }: Props) {
  const emailRef = useRef<HTMLInputElement>(null);

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [familyName, setFamilyName] = useState("your family");

  useEffect(() => {
    const loadSurname = async () => {
      setFamilyName(`the ${await getFamilySurname(familyId)} family`);
      setLoading(false);
    };
    loadSurname();
  }, []);

  const resetForm = () => {
    setInviteSent(false);
    setError(null);
    setLoading(false);
    setAttempted(false);
  };

  const displayForm = () => {
    if (inviteSent) {
      return (
        <>
          <p>Invite sent!</p>
          <p>
            If a user exists with the email provided, they will receive an
            invite in their dashboard to join <b>{familyName}</b>.
          </p>
          <button
            className="self-start font-bold text-violet-900 hover:underline focus:underline"
            type="button"
            onClick={resetForm}
          >
            Send another invite
          </button>
        </>
      );
    }
    return (
      <>
        <p>
          Enter the email address of a user you&apos;d like to invite to join{" "}
          <b>{familyName}</b>.
        </p>
        <p>
          If a user exists with the email provided, they will receive an invite
          in their dashboard to join.
        </p>
        <Input
          attempted={attempted}
          errorText="Invalid email"
          id="email"
          labelText="Email"
          maxLength={255}
          ref={emailRef}
          required
          type="email"
        />
        {error ? <div className="text-red-700">{error}</div> : null}
        <Button style="submit" type="submit">
          SUBMIT
        </Button>
      </>
    );
  };

  const submitForm = async (formData: FormData) => {
    setAttempted(true);
    setError(null);
    const emailInput = emailRef.current;
    const valid = emailInput?.checkValidity() || false;

    if (valid) {
      try {
        setLoading(true);
        setError(null);
        await inviteNewMember(familyId, formData);
        setInviteSent(true);
      } catch (err) {
        console.error(err);
        setError("Error sending invite");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form action={submitForm} className="text-lg" noValidate>
      <Card
        borderColor="border-emerald-400"
        flair={<Image alt="" className="p-2" src={inviteIcon} width={48} />}
        heading="Invite New Member"
        headingColor="bg-emerald-200"
      >
        {loading ? (
          <div className="p-2 pb-4">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayForm()}
            <Link
              className="font-bold text-violet-900 hover:underline focus:underline"
              href={`/families/${familyId}`}
            >{`Back to ${familyName}`}</Link>
          </div>
        )}
      </Card>
    </form>
  );
}
