"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { getFamilySurname, inviteNewMember } from "@/lib/db/families";

export default function Invite({ params }: { params: { familyId: string } }) {
  const familyId = +params.familyId;

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
            invite in their dashboard to join {familyName}.
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
          {familyName}.
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
          required
          type="email"
        />
        {error ? <div className="text-red-700">{error}</div> : null}
        <button
          className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
          type="submit"
        >
          Submit
        </button>
      </>
    );
  };

  return (
    <main className="flex flex-col p-2">
      <form
        action={async (formData: FormData) => {
          // XXX FIXME XXX
          // wonky - validity is internal to the Input component, but we need
          // it here too...better option than this?
          const element = document.querySelector("#email") as HTMLInputElement;
          const { valid } = element.validity;
          setAttempted(true);
          if (valid) {
            setLoading(true);
            setError(null);
            try {
              await inviteNewMember(familyId, formData);
              setInviteSent(true);
            } catch (err) {
              console.error(err);
              setError("Error sending invite");
            }
            setLoading(false);
          }
        }}
        className="text-lg"
        noValidate
      >
        <Card heading="Invite New Member" headingColor="bg-amber-200">
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
    </main>
  );
}
