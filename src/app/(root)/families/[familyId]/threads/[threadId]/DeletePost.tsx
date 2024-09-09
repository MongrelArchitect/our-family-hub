"use client";
import { useState } from "react";

import Button from "@/components/Button";
import Loading from "@/components/Loading";

import { deletePost } from "@/lib/db/threads";

interface Props {
  familyId: number;
  postId: number;
  threadId: number;
}

export default function DeletePost({ familyId, postId, threadId }: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleConfirmingDelete = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const submitDelete = async () => {
    try {
      setLoading(true);
      await deletePost(postId, familyId, threadId);
    } catch (err) {
      setError("Error deleting thread");
      console.error("Error deleting thread: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (confirmingDelete) {
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <div className="text-red-700">
          Are you sure you want to delete this post? <b>This cannot be undone!</b>
        </div>
        <>
          <Button onClick={toggleConfirmingDelete} style="cancel" type="button">
            CANCEL
          </Button>
          <Button onClick={submitDelete} style="delete" type="button">
            CONFIRM
          </Button>
        </>
        {error ? <div className="text-red-700">{error}</div> : null}
      </>
    );
  }

  return (
    <>
      <Button onClick={toggleConfirmingDelete} style="delete" type="button">
        DELETE
      </Button>
    </>
  );
}
