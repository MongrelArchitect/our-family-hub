"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import threadIcon from "@/assets/icons/chat.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import TextArea from "@/components/TextArea";

import { getFamilyInfo } from "@/lib/db/families";
import { createNewThread } from "@/lib/db/threads";

import FamilyInterface from "@/types/Families";

interface Props {
  familyId: number;
}

export default function NewThreadForm({ familyId }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyInfo, setFamilyInfo] = useState<FamilyInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFamilyInfo = async () => {
      setFamilyInfo(await getFamilyInfo(familyId));
      setLoading(false);
    };
    loadFamilyInfo();
  }, []);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const checkFormValidity = (): boolean => {
    const titleInput = titleRef.current;
    const validTitle = titleInput?.checkValidity() || false;
    const contentTextArea = contentRef.current;
    const validContent = contentTextArea?.checkValidity() || false;
    return validTitle && validContent;
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    if (checkFormValidity()) {
      try {
        // add the new thread to the db, getting its id in return
        setError(null);
        setLoading(true);
        const threadId = await createNewThread(familyId, formData);
        router.push(`/families/${familyId}/threads/${threadId}`);
      } catch (err) {
        setLoading(false);
        setError("Error creating new thread");
        console.error("Error creating new thread: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form className="text-lg" action={submit} noValidate>
      <Card
        borderColor="border-teal-400"
        flair={<Image alt="" className="p-2" src={threadIcon} width={48} />}
        heading="Create New Thread"
        headingColor="bg-teal-200"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-4">
            A discussion thread requires a title and content. Wouldn&apos;t be
            much of a thread without those!
            <Input
              attempted={attempted}
              errorText="Title required"
              id="title"
              labelText="Title"
              maxLength={255}
              ref={titleRef}
              required
              type="text"
            />
            <TextArea
              attempted={attempted}
              errorText="Content required"
              id="content"
              labelText="Content"
              maxLength={20000}
              ref={contentRef}
              required
              rows={5}
            />
            {attempted && error ? (
              <div className="p-2 text-red-700">{error}</div>
            ) : null}
            <Button style="submit" type="submit">
              SUBMIT
            </Button>
            <Link
              className="font-bold text-violet-900 hover:underline focus:underline"
              href={`/families/${familyId}`}
            >{`Back to The ${familyInfo?.surname || ""} Family`}</Link>
          </div>
        )}
      </Card>
    </form>
  );
}
