"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import newFamilyIcon from "@/assets/icons/home-plus.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { createNewFamily } from "@/lib/db/families";
import { addNewFamilyImage} from "@/lib/images/images";

export default function NewFamilyForm() {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const surnameRef = useRef<HTMLInputElement>(null);

  const checkFormValidity = (formData: FormData): boolean => {
    const surnameInput = surnameRef.current;
    const validImage = +(formData.get(
      "new-family-image-validity",
    ) as unknown as number)
      ? true
      : false;
    return (surnameInput?.checkValidity() && validImage) || false;
  };

  const router = useRouter();

  const submit = async (formData: FormData) => {
    setAttempted(true);
    setError(null);
    if (checkFormValidity(formData)) {
      try {
        // add the new family to the db, getting its id in return
        setLoading(true);
        const familyId = await createNewFamily(formData);
        await addNewFamilyImage("new-family-image", familyId, formData);
        router.push(`/families/${familyId}`);
      } catch (err) {
        setLoading(false);
        setError("Error submitting new family");
        console.error("Error submitting new family: ", err);
      }
    }
  };

  return (
    <form className="text-lg" action={submit} noValidate>
      <Card
        borderColor="border-emerald-400"
        flair={<Image alt="" className="p-2" src={newFamilyIcon} width={48} />}
        heading="Create New Family"
        headingColor="bg-emerald-200"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-2">
            Enter a surname for your new family. You can always change it later.
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
            Choose an image to represent your family (optional).
            <ImagePicker
              attempted={attempted}
              clearTrigger={false}
              id="new-family-image"
            />
            {attempted && error ? (
              <div className="p-2 text-red-700">{error}</div>
            ) : null}
            <Button style="submit" type="submit">
              SUBMIT
            </Button>
          </div>
        )}
      </Card>
    </form>
  );
}
