"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import alertIcon from "@/assets/icons/alert.svg";

import Loading from "@/app/components/loading";

import { createNewFamily } from "@/lib/db/families";

interface FormInfo {
  [key: string]: {
    typing: boolean;
    value: string;
    valid: boolean;
  };
}

export default function NewFamily() {
  const defaultFormInfo: FormInfo = {
    // we just have one field for now, might want more in the future
    surname: {
      typing: false, // for the input's "moving label" effect
      value: "",
      valid: false,
    },
  };

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formInfo, setFormInfo] = useState(defaultFormInfo);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const checkFormValidity = (): boolean => {
    // check if all form fields are valid - relies on html5 form validation
    let valid = false;
    const fields = Object.keys(formInfo);
    fields.forEach((field) => {
      valid = formInfo[field].valid;
    });
    return valid;
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setError(null);
    const { id } = target;
    switch (id) {
      // makes it easier to add more fields in the future if needed
      case "surname":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            surname: {
              typing: true,
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const handleFocus = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { id } = target;
    switch (id) {
      // makes it easier to add more fields in the future if needed
      case "surname":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            surname: {
              ...formInfo.surname,
              typing:
                document.activeElement && document.activeElement.id === id
                  ? true
                  : false,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setAttempted(true);
    setError(null);
    if (checkFormValidity()) {
      try {
        // add the new family to the db, getting its id in return
        setLoading(true);
        const familyId = await createNewFamily(formInfo.surname.value);
        router.push(`/families/${familyId}`);
      } catch (err) {
        setLoading(false);
        setError("Error submitting new family");
        console.error("Error submitting new family: ", err);
      }
    } else {
      setError("Invalid input - check each field");
    }
  };

  return (
    <main className="p-2">
      {loading ? <Loading /> : null}
      <form
        action={""}
        className={`${loading ? "hidden" : ""} flex flex-col gap-4 text-lg`}
        onSubmit={submit}
        noValidate
      >
        <h2 className="text-2xl">Create New Family</h2>
        <div className="relative flex flex-col">
          <label
            className={`${formInfo.surname.typing || formInfo.surname.value ? "-translate-x-1.5 -translate-y-3 scale-75 text-neutral-400" : ""} absolute left-2 top-3 text-neutral-600 transition-all`}
            htmlFor="surname"
          >
            Surname
          </label>
          {attempted && !formInfo.surname.valid ? (
            <Image
              alt=""
              className="alert-red absolute right-2 top-3.5"
              src={alertIcon}
            />
          ) : null}
          <input
            className={`${attempted && !formInfo.surname.valid ? "border-red-700" : "hover:border-black focus:border-black"} border-2 border-neutral-600 p-2 pt-4 outline-none`}
            id="surname"
            maxLength={255}
            name="surname"
            onBlur={handleFocus}
            onChange={handleChange}
            onFocus={handleFocus}
            required
            type="text"
            value={formInfo.surname.value || ""}
          />
          {attempted && !formInfo.surname.valid ? (
            <div className="absolute right-10 top-4 text-sm text-red-700">
              Required
            </div>
          ) : null}
        </div>
        {attempted && !formInfo.surname.valid ? (
          <div className="text-red-700">{error}</div>
        ) : null}
        <button
          className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
          type="submit"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
