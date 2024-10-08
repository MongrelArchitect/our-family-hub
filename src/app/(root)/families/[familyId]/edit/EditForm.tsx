"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import editIcon from "@/assets/icons/home-edit.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { editFamilySurname, getFamilySurname } from "@/lib/db/families";
import { updateFamilyImage } from "@/lib/images/images";

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
            Family edited successfully.
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
        <p>Edit your family's surname and image below.</p>
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
        <ImagePicker
          attempted={attempted}
          clearTrigger={false}
          familyId={familyId}
          id="family-image"
        />
        {error ? <div className="text-red-700">{error}</div> : null}
        <Button style="submit" type="submit">
          SUBMIT
        </Button>
      </>
    );
  };

  const checkFormValidity = (formData: FormData) => {
    const surnameInput = surnameRef.current;
    const validSurname = surnameInput ? surnameInput.checkValidity() : false;
    const validImage = +(formData.get(
      "family-image-validity",
    ) as unknown as number)
      ? true
      : false;
    return validSurname && validImage;
  };

  const submitForm = async (formData: FormData) => {
    setAttempted(true);
    setError(null);

    if (checkFormValidity(formData)) {
      try {
        setLoading(true);
        // only perform the update the surname has actually been changed
        if (formData.get("surname") !== surname) {
          await editFamilySurname(familyId, formData);
        }
        // likewise for the image
        const file = formData.get("family-image") as File;
        if (file.size) {
          await updateFamilyImage("family-image", familyId, formData);
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
      <Card
        borderColor="border-emerald-400"
        flair={<Image alt="" className="p-2" src={editIcon} width={48} />}
        heading="Edit Family Info"
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
            >{`Back to The ${surname} Family`}</Link>
          </div>
        )}
      </Card>
    </form>
  );
}
