"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { editFamilySurname, getFamilySurname } from "@/lib/db/families";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

interface Props {
  familyId: number;
}

export default function EditForm({ familyId }: Props) {
  const surnameRef = useRef<HTMLInputElement>(null);

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [surname, setSurname] = useState("your family");

  useEffect(() => {
    const loadSurname = async () => {
      setLoading(true);
      setSurname(await getFamilySurname(familyId));
      setLoading(false);
    };
    loadSurname();
  }, [success]);

  const resetForm = () => {
    setAttempted(false);
    setError(null);
    setSuccess(false);
  };

  const displayForm = () => {
    if (success) {
      return (
        <>
          <p>
            Surname edited successfully. Your family is now{" "}
            <b>{`The ${surname} Family`}.</b>
          </p>
          <button
            className="self-start font-bold text-violet-900 hover:underline focus:underline"
            type="button"
            onClick={resetForm}
          >
            Continue editing
          </button>
        </>
      );
    }
    return (
      <>
        <p>Edit your family's surname below.</p>
        <Input
          attempted={attempted}
          defaultValue={surname}
          errorText="Surname required"
          id="surname"
          labelText="Surname"
          maxLength={255}
          ref={surnameRef}
          required
          type="text"
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

  const submitForm = async (formData: FormData) => {
    setAttempted(true);
    setError(null);
    const surnameInput = surnameRef.current;
    const valid = surnameInput?.checkValidity() || false;

    if (valid) {
      try {
        setLoading(true);
        // only perform the update the surname has actually been changed
        if (formData.get("surname") !== surname) {
          await editFamilySurname(familyId, formData);
        }
        setSuccess(true);
      } catch (err) {
        console.error(err);
        setError("Error editing family");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form action={submitForm} className="text-lg" noValidate>
      <Card heading="Edit Family Info" headingColor="bg-amber-200">
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
            >{`Back to The ${surname} Family`}</Link>
          </div>
        )}
      </Card>
    </form>
  );
}
