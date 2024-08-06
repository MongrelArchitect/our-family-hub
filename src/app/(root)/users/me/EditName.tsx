"use client";
import Image from "next/image";
import { useRef, useState } from "react";

import closeIcon from "@/assets/icons/close-circle.svg";
import editIcon from "@/assets/icons/pencil.svg";
import saveIcon from "@/assets/icons/save.svg";

import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { editUserName } from "@/lib/db/users";

interface Props {
  name: string;
}

export default function EditNameForm({ name }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);

  const [attempted, setAttempted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    if (nameRef.current?.validity.valid) {
      try {
        setLoading(true);
        await editUserName(formData);
        toggleEditing();
      } catch (err) {
        console.error(err);
        setError("Error changing name");
      } finally {
        setLoading(false);
      }
    }
  };

  const showForm = () => {
    return (
      <div
        aria-hidden={editing}
        className={`${editing ? null : "pointer-events-none opacity-0"} absolute left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 backdrop-blur-sm transition-all`}
        id="grayout"
        onClick={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLDivElement;
          // prevent visibility toggling due to clicks bubbling up from input
          if (target.id === "grayout") {
            toggleEditing();
            setAttempted(false);
          }
        }}
      >
        <div className={`${editing ? "" : "-translate-y-full"} transition-all`}>
          <Card heading="Edit Name" headingColor="bg-emerald-200">
            {loading ? (
              <Loading />
            ) : (
              <form
                action={submit}
                className="flex flex-col gap-4"
                id="new-post-form"
                noValidate
              >
                <Input
                  attempted={attempted}
                  clearTrigger={editing}
                  defaultValue={name}
                  id="name"
                  labelText="Name"
                  maxLength={255}
                  tabIndex={editing ? 0 : -1}
                  type="text"
                  ref={nameRef}
                  required
                />

                {error ? <div className="text-red-700">{error}</div> : null}

                <button
                  className="flex items-center justify-center gap-2 bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                  tabIndex={editing ? 0 : -1}
                  type="submit"
                >
                  <Image alt="" src={saveIcon} width={32} />
                  Save
                </button>

                <button
                  aria-hidden={!editing}
                  aria-controls="new-post-form"
                  aria-expanded={editing}
                  className="flex items-center justify-center gap-2 bg-rose-200 p-2 hover:bg-rose-300 focus:bg-rose-300"
                  onClick={() => {
                    toggleEditing();
                    setAttempted(false);
                  }}
                  tabIndex={editing ? 0 : -1}
                  type="button"
                >
                  <Image alt="" src={closeIcon} width={32} />
                  Cancel
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {showForm()}
      <span>{name}</span>
      <button onClick={toggleEditing} title="Edit name" type="button">
        <Image alt="" src={editIcon} width={32} />
      </button>
    </div>
  );
}
