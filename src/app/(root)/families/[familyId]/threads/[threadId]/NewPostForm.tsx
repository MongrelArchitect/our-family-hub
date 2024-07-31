"use client";
import { useRef, useState } from "react";

import Card from "@/components/Card";
import Loading from "@/components/Loading";
import TextArea from "@/components/TextArea";
import { createNewPost } from "@/lib/db/threads";

interface Props {
  familyId: number;
  threadId: number;
}

export default function NewPostForm({ familyId, threadId }: Props) {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const checkFormValidity = (): boolean => {
    const validContent = contentRef.current?.validity.valid;
    return validContent || false;
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    if (checkFormValidity()) {
      try {
        setLoading(true);
        await createNewPost(threadId, familyId, formData);
        setAttempted(false);
        toggleVisible();
      } catch (err) {
        setError("Error submitting new post");
        console.error("Error submitting new post: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const showForm = () => {
    return (
      <div
        aria-hidden={visible}
        className={`${visible ? null : "pointer-events-none opacity-0"} absolute left-0 top-0 z-10 h-screen w-full bg-neutral-600/20 backdrop-blur-sm transition-all`}
        id="grayout"
        onClick={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLDivElement;
          // prevent visibility toggling due to clicks bubbling up from input
          if (target.id === "grayout") {
            toggleVisible();
            setAttempted(false);
          }
        }}
      >
        <div className={`${visible ? "" : "-translate-y-full"} transition-all`}>
          <Card heading="Post Reply" headingColor="bg-emerald-200">
            {loading ? (
              <Loading />
            ) : (
              <form
                action={submit}
                className="flex flex-col gap-4"
                id="new-post-form"
                noValidate
              >
                <TextArea
                  attempted={attempted}
                  clearTrigger={visible}
                  errorText="Content required"
                  id="content"
                  labelText="Content"
                  maxLength={20000}
                  ref={contentRef}
                  required
                  rows={5}
                  tabIndex={visible ? 0 : -1}
                />

                {error ? <div className="text-red-700">{error}</div> : null}

                <button
                  className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                  tabIndex={visible ? 0 : -1}
                  type="submit"
                >
                  Submit
                </button>

                <button
                  aria-hidden={!visible}
                  aria-controls="new-post-form"
                  aria-expanded={visible}
                  className="bg-rose-200 p-2 hover:bg-rose-300 focus:bg-rose-300"
                  onClick={() => {
                    toggleVisible();
                    setAttempted(false);
                  }}
                  tabIndex={visible ? 0 : -1}
                  type="button"
                >
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
    <>
      {showForm()}
      <div className="flex flex-col">
        <button
          aria-hidden={visible}
          aria-controls="new-post-form"
          aria-expanded={visible}
          className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
          onClick={toggleVisible}
          type="button"
        >
          + Post reply
        </button>
      </div>
    </>
  );
}
