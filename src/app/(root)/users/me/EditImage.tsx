"use client";
import Image from "next/image";
import { useState } from "react";

import closeIcon from "@/assets/icons/close-circle.svg";
import editIcon from "@/assets/icons/pencil.svg";
import saveIcon from "@/assets/icons/save.svg";
import Card from "@/components/Card";
import ImagePicker from "@/components/ImagePicker";
import Loading from "@/components/Loading";

interface Props {
  image: string;
}

export default function EditImageForm({ image }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const submit = () => {};

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
          <Card heading="Edit Image" headingColor="bg-emerald-200">
            {loading ? (
              <Loading />
            ) : (
              <form
                action={submit}
                className="flex flex-col gap-4"
                id="edit-image-form"
                noValidate
              >
                <ImagePicker defaultImage={image} id="image-picker" />

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
                  aria-controls="edit-image-form"
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
    <div>
      {showForm()}
      <div className="relative">
        <img
          alt=""
          className="max-h-[96px] max-w-[96px] flex-1 rounded-full"
          src={image}
        />
        <button
          aria-hidden={editing}
          aria-controls="edit-image-form"
          aria-expanded={editing}
          className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow-md shadow-slate-600"
          onClick={toggleEditing}
          tabIndex={editing ? -1 : 0}
          title="Edit image"
          type="button"
        >
          <Image alt="" src={editIcon} width={32} />
        </button>
      </div>
    </div>
  );
}
