"use client";
import Image from "next/image";
import { useRef, useState } from "react";

import editIcon from "@/assets/icons/pencil.svg";
import editNameIcon from "@/assets/icons/tag-edit.svg";

import Button from "@/components/Button";
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
        className={`${editing ? null : "pointer-events-none opacity-0"} fixed left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 backdrop-blur-sm transition-all`}
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
        <div
          className={`${editing ? null : "-translate-y-full"} transition-all`}
        >
          <Card
            borderColor="border-green-400"
            flair={
              <Image alt="" className="p-2" src={editNameIcon} width={48} />
            }
            heading="Edit Name"
            headingColor="bg-green-200"
          >
            {loading ? (
              <Loading />
            ) : (
              <form
                action={submit}
                className="flex flex-col gap-4"
                id="edit-name-form"
                noValidate
              >
                Enter a new name below. This will change your name anywhere it
                is visible, so make sure your fellow family members know who you
                are!
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
                <Button
                  ariaHidden={!editing}
                  style="submit"
                  tabIndex={editing ? 0 : -1}
                  type="submit"
                >
                  SAVE
                </Button>
                <Button
                  ariaHidden={!editing}
                  ariaControls="edit-name-form"
                  ariaExpanded={editing}
                  onClick={() => {
                    toggleEditing();
                    setAttempted(false);
                  }}
                  style="cancel"
                  tabIndex={editing ? 0 : -1}
                  type="button"
                >
                  CANCEL
                </Button>
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
      <button
        aria-hidden={editing}
        aria-controls="edit-name-form"
        aria-expanded={editing}
        className="rounded-full bg-white p-1 shadow-md shadow-slate-600 hover:bg-indigo-300 focus:bg-indigo-300"
        onClick={toggleEditing}
        tabIndex={editing ? -1 : 0}
        title="Edit name"
        type="button"
      >
        <Image alt="" src={editIcon} width={32} />
      </button>
    </div>
  );
}
