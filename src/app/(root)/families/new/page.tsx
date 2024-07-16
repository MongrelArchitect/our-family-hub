"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { createNewFamily } from "@/lib/db/families";

export default function NewFamily() {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const surnameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const checkFormValidity = (): boolean => {
    const surnameInput = surnameRef.current;
    return surnameInput?.checkValidity() || false;
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    setError(null);
    if (checkFormValidity()) {
      try {
        // add the new family to the db, getting its id in return
        setLoading(true);
        const familyId = await createNewFamily(formData);
        router.push(`/families/${familyId}`);
      } catch (err) {
        setLoading(false);
        setError("Error submitting new family");
        console.error("Error submitting new family: ", err);
      }
    }
  };

  return (
    <main className="p-2">
      <form className="text-lg" action={submit} noValidate>
        <Card heading="Create New Family" headingColor="bg-emerald-200">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-2">
              <Input
                attempted={attempted}
                errorText="Surname required"
                id="surname"
                labelText="Surname"
                maxLength={255}
                ref={surnameRef}
                required
                type="text"
              />
              {attempted && error ? (
                <div className="p-2 text-red-700">{error}</div>
              ) : null}
              <button
                className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                type="submit"
              >
                Submit
              </button>
            </div>
          )}
        </Card>
      </form>
    </main>
  );
}
