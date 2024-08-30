"use client";
import Image from "next/image";
import { useContext, useState } from "react";

import editIcon from "@/assets/icons/pencil.svg";
import imageEditIcon from "@/assets/icons/image-edit.svg";

import Button from "@/components/Button";
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
        className={`${editing ? null : "pointer-events-none opacity-0"} fixed left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 backdrop-blur-sm transition-all`}
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
          <Card
            borderColor="border-green-400"
            flair={
              <Image alt="" className="p-2" src={imageEditIcon} width={48} />
            }
            heading="Edit Profile Image"
            headingColor="bg-green-200"
          >
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
                tabIndex={editing ? 0 : -1}
                userId={userId}
              />

              {error ? <div className="text-red-700">{error}</div> : null}

              {loading ? (
                <Loading />
              ) : (
                <>
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
                    ariaControls="edit-image-form"
                    ariaExpanded={editing}
                    onClick={() => {
                      toggleEditing();
                      setError(null);
                    }}
                    style="cancel"
                    tabIndex={editing ? 0 : -1}
                    type="button"
                  >
                    CANCEL
                  </Button>
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
          className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow-md shadow-slate-600 hover:bg-indigo-300 focus:bg-indigo-300"
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
