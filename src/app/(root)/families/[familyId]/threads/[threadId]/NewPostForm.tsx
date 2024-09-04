"use client";
import Image from "next/image";
import { useRef, useState } from "react";

import replyIcon from "@/assets/icons/comment-plus.svg";

import Button from "@/components/Button";
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
        className={`${visible ? null : "pointer-events-none opacity-0"} fixed left-0 top-0 z-10 flex h-screen w-full flex-col items-center bg-neutral-600/20 backdrop-blur-sm transition-all`}
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
        <div
          className={`${visible ? "" : "-translate-y-full"} w-full max-w-[500px] transition-all`}
        >
          <Card
            borderColor="border-teal-400"
            flair={<Image alt="" className="p-2" src={replyIcon} width={48} />}
            heading="Post Reply"
            headingColor="bg-teal-200"
          >
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
                <Button
                  ariaHidden={!visible}
                  style="submit"
                  tabIndex={visible ? 0 : -1}
                  type="submit"
                >
                  SUBMIT
                </Button>
                <Button
                  ariaHidden={!visible}
                  ariaControls="new-post-form"
                  ariaExpanded={visible}
                  onClick={() => {
                    toggleVisible();
                    setAttempted(false);
                  }}
                  style="cancel"
                  tabIndex={visible ? 0 : -1}
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
    <>
      {showForm()}
      <div className="flex flex-col">
        <Button
          ariaHidden={visible}
          ariaControls="new-post-form"
          ariaExpanded={visible}
          onClick={toggleVisible}
          style="add"
          type="button"
        >
          POST REPLY
        </Button>
      </div>
    </>
  );
}
