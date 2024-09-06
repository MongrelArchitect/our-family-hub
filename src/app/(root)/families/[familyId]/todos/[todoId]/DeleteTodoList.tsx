"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button";
import Loading from "@/components/Loading";

import { deleteTodoList } from "@/lib/db/todos";

interface Props {
  familyId: number;
  todoId: number;
}

export default function DeleteTodoList({ familyId, todoId }: Props) {
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleConfirmDelete = () => {
    setConfirming(!confirming);
  };

  const submitDelete = async () => {
    try {
      setError(null);
      setLoading(true);
      await deleteTodoList(familyId, todoId);
      router.push(`/families/${familyId}`)
    } catch (err) {
      console.error("Error deleting todo list: ", err);
      setError("Error deleting todo list");
    } finally {
      setLoading(false);
    }
  };

  if (confirming) {
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <div className="text-red-700">
          Are you sure? <b>This cannot be undone!</b>
        </div>
        <Button onClick={toggleConfirmDelete} style="cancel" type="button">
          CANCEL
        </Button>
        <Button onClick={submitDelete} style="delete" type="button">
          CONFIRM
        </Button>
        {error ? <div className="font-bold text-red-700">{error}</div> : null}
      </>
    );
  }

  return (
    <Button onClick={toggleConfirmDelete} style="delete" type="button">
      DELETE
    </Button>
  );
}
