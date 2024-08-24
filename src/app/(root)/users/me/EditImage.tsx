"use client";
import Image from "next/image";
import { useContext, useState } from "react";

import closeIcon from "@/assets/icons/close-circle.svg";
import editIcon from "@/assets/icons/pencil.svg";
import saveIcon from "@/assets/icons/save.svg";
import Card from "@/components/Card";
import ImagePicker from "@/components/ImagePicker";
import Loading from "@/components/Loading";
import ProfileImage from "@/components/ProfileImage";
import { ProfileContext } from "@/contexts/Profile";
import { updateProfileImage } from "@/lib/images/images";

interface Props {
  userId: number;
}

export default function EditImageForm({ userId }: Props) {
  const profile = useContext(ProfileContext);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const chooseInvalidFileError = (file: File) => {
    if (!file.type.includes("image/")) {
      return "File is not an image";
    }
    if (file.size > 21000000) {
      return "Image is too large (20MB max)";
    }
    return null;
  };

  const checkValidImage = (file: File) => {
    if (!file.type.includes("image/") || file.size > 21000000) {
      return false;
    }
    return true;
  };

  const submit = async (formData: FormData) => {
    const file = formData.get("image-picker") as File;
    if (file.name && file.size > 0) {
      if (checkValidImage(file)) {
        try {
          setLoading(true);
          await updateProfileImage("image-picker", formData);
          profile.updateProfile();
          toggleEditing();
          setError(null);
        } catch (err) {
          console.error("Error uploading file: ", err);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error uploading file");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError(chooseInvalidFileError(file));
      }
    } else {
      setError("No file chosen");
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
            setError(null);
          }
        }}
      >
        <div className={`${editing ? "" : "-translate-y-full"} transition-all`}>
          <Card heading="Edit Image" headingColor="bg-emerald-200">
            <form
              action={submit}
              className="flex flex-col gap-4"
              id="edit-image-form"
              noValidate
            >
              <ImagePicker
                clearTrigger={editing}
                forProfile
                id="image-picker"
                removeError={() => {
                  setError(null);
                }}
                userId={userId}
              />

              {error ? <div className="text-red-700">{error}</div> : null}

              {loading ? (
                <Loading />
              ) : (
                <>
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
                      setError(null);
                    }}
                    tabIndex={editing ? 0 : -1}
                    type="button"
                  >
                    <Image alt="" src={closeIcon} width={32} />
                    Cancel
                  </button>
                </>
              )}
            </form>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div>
      {showForm()}
      <div className="relative">
        <ProfileImage reloadTrigger={editing} size={128} userId={userId} />
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
