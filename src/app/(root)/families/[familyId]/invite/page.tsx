"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
        <div className="flex flex-col items-start gap-8 p-2 text-xl">
          <p>Invite sent!</p>
          <p>
            If a user exists with the email provided, they will receive an
            invite in their dashboard to join {familyName}.
          </p>
          <button
            className="font-bold text-violet-900 hover:underline focus:underline"
            type="button"
            onClick={resetForm}
          >
            Send another invite
          </button>
        </div>
      );
    }
    return (
      <>
        <p className="p-2">
          Enter the email address of a user you&apos;d like to invite to join{" "}
          {familyName}.
        </p>
        <p className="p-2">
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
        {error ? <div className="p-2 text-red-700">{error}</div> : null}
        <button
          className="m-2 bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
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
        className="flex flex-col gap-4 bg-slate-100 text-lg shadow-md shadow-slate-500"
        noValidate
      >
        <h2 className="bg-amber-200 p-2 text-2xl">Invite New Member</h2>
        {loading ? (
          <div className="p-2 pb-4">
            <Loading />
          </div>
        ) : (
          displayForm()
        )}
        <div className="p-2 text-xl">
          <Link
            className="font-bold text-violet-900 hover:underline focus:underline"
            href={`/families/${familyId}`}
          >{`Back to ${familyName}`}</Link>
        </div>
      </form>
    </main>
  );
}
