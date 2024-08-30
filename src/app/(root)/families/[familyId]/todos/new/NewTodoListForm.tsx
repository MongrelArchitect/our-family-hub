"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import todoListIcon from "@/assets/icons/text-box.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import { getFamilyInfo } from "@/lib/db/families";
import { createNewTodoList } from "@/lib/db/todos";

import FamilyInterface from "@/types/Families";

interface Props {
  familyId: number;
}

export default function NewTodoListForm({ familyId }: Props) {
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
  const descriptionRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const checkFormValidity = (): boolean => {
    const titleInput = titleRef.current;
    const validTitle = titleInput?.checkValidity() || false;
    const descriptionInput = descriptionRef.current;
    const validDescription = descriptionInput?.checkValidity() || false;
    return validTitle && validDescription;
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    if (checkFormValidity()) {
      try {
        // add the new todo list to the db, getting its id in return
        setError(null);
        setLoading(true);
        const todoListId = await createNewTodoList(familyId, formData);
        router.push(`/families/${familyId}/todos/${todoListId}`);
      } catch (err) {
        setLoading(false);
        setError("Error creating new todo list");
        console.error("Error creating new todo list: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form className="text-lg" action={submit} noValidate>
      <Card
        borderColor="border-sky-400"
        flair={<Image alt="" className="p-2" src={todoListIcon} width={48} />}
        heading="Create New Todo List"
        headingColor="bg-sky-200"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-4">
            Your new todo list needs a title, but a description is optional.
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
            <Input
              attempted={attempted}
              id="description"
              labelText="Description (optional)"
              maxLength={255}
              ref={descriptionRef}
              type="text"
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
