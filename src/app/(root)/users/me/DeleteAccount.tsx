"use client";
import { useState } from "react";

import Button from "@/components/Button";

export default function DeleteAccount() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [doubleChecked, setDoubleChecked] = useState(false);

  const toggleConfirming = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const submitDelete = async () => {};

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
            Please confirm that you would like to delete your account. This will
            remove your name, email, image and any related account information
            from our database, but{" "}
            <b>will not remove any content you have created</b>. All families
            with you as admin will still exist and will remain accessible to
            other members, but <b>will be without an admin</b>. This is
            permanent and <b>your account cannot be recovered</b> - any future
            logins with the same email will create an entirely new account.
          <b className="text-red-700">This cannot be undone!</b>
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
        <Button onClick={() => {
          toggleConfirming();
          setDoubleChecked(false);
          }} style="cancel" type="button">
          CANCEL
        </Button>
        <Button
          disabled={!doubleChecked}
          onClick={submitDelete}
          style="delete"
          type="button"
        >
          CONFIRM
        </Button>
      </>
    );
  }

  return (
    <Button onClick={toggleConfirming} style="delete" type="button">
      DELETE
    </Button>
  );
}
