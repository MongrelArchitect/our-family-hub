"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Card from "@/components/Card";
import Input from "@/components/Input";
import Loading from "@/components/Loading";

import {getFamilyInfo} from "@/lib/db/families";
import { createNewTodoList } from "@/lib/db/todos";

import FamilyInterface from "@/types/Families";

export default function NewTodolist({ params }: { params: { familyId: string } }) {
  const familyId = +params.familyId;

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
        // add the new family to the db, getting its id in return
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
    <main className="p-2">
      <form className="text-lg" action={submit} noValidate>
        <Card heading="Create New Todo List" headingColor="bg-emerald-200">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-4">
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

              <button
                className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                type="submit"
              >
                Submit
              </button>
              <Link
                className="font-bold text-violet-900 hover:underline focus:underline"
                href={`/families/${familyId}`}
              >{`Back to The ${familyInfo?.surname || ""} Family`}</Link>
            </div>
          )}
        </Card>
      </form>
    </main>
  );
}
