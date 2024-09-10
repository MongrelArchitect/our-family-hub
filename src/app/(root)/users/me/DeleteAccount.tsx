"use client";
import { useState } from "react";

import { signOut } from "@/auth";

import Button from "@/components/Button";
import Loading from "@/components/Loading";

import { deleteUser } from "@/lib/db/users";

export default function DeleteAccount() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [doubleChecked, setDoubleChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleConfirming = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const submitDelete = async () => {
    try {
      setLoading(true);
      await deleteUser();
      await signOut();
    } catch (err) {
      console.error("Error deleting account: ", err);
      setError("Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setDoubleChecked(target.checked);
  };

  if (confirmingDelete) {
    return (
      <>
        <div>
          <h3 className="font-bold text-red-700">Confirm Account Deletion</h3>
          <p>
            Your account will be deleted, but any{" "}
            <b>content you&apos;ve created will remain</b>. Families you created
            will still be accessible to members but{" "}
            <b>will not have an admin</b>. This is permanent -{" "}
            <b>your account cannot be recovered</b>, and future logins with the
            same email will create a new account.{" "}
            <b className="text-red-700">This action cannot be undone!</b>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            checked={doubleChecked}
            className="size-5 accent-red-700"
            id="confirm-delete"
            onChange={handleClick}
            type="checkbox"
          />
          <label htmlFor="confirm-delete">Delete my account</label>
        </div>
        {error ? <div className="text-red-700">{error}</div> : null}
        <Button
          onClick={() => {
            toggleConfirming();
            setDoubleChecked(false);
          }}
          style="cancel"
          type="button"
        >
          CANCEL
        </Button>
        {loading ? (
          <Loading />
        ) : (
          <Button
            disabled={!doubleChecked}
            onClick={submitDelete}
            style="delete"
            type="button"
          >
            CONFIRM
          </Button>
        )}
      </>
    );
  }

  return (
    <Button onClick={toggleConfirming} style="delete" type="button">
      DELETE
    </Button>
  );
}
