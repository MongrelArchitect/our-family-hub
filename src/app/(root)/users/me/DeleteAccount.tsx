"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import Button from "@/components/Button";
import Loading from "@/components/Loading";

import { deleteUser } from "@/lib/db/users";
import { deleteProfileImage } from "@/lib/images/images";

import FamilyInterface from "@/types/Families";
import { getAllAdminFamilies } from "@/lib/db/families";

export default function DeleteAccount() {
  const [adminFamilies, setAdminFamilies] = useState<FamilyInterface[]>([]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [doubleChecked, setDoubleChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFamilies = async () => {
      setAdminFamilies(await getAllAdminFamilies());
    };
    getFamilies();
  }, []);

  const toggleConfirming = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const submitDelete = async () => {
    try {
      setLoading(true);
      await deleteProfileImage();
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

  const showAdminFamilies = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-red-700">Cannot Delete Account</h3>
          <p>
            Your account cannot be deleted because you are the{" "}
            <b>
              admin of {adminFamilies.length} famil
              {adminFamilies.length === 1 ? "y" : "ies"}
            </b>
            . Please either delete these families or assign them new admins
            before deleting your account:
          </p>
          <ul className="flex flex-col gap-2">
            {adminFamilies.map((family) => {
              return (
                <li key={`family-${family.id}`}>
                  <Link
                    className="font-bold text-violet-800 hover:underline focus:underline"
                    href={`/families/${family.id}`}
                  >
                    The {family.surname} Family
                  </Link>{" "}
                  ({family.memberCount} member
                  {family.memberCount === 1 ? "" : "s"})
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  };

  if (confirmingDelete) {
    return (
      <>
        {adminFamilies.length ? (
          showAdminFamilies()
        ) : (
          <>
            <div>
              <h3 className="font-bold text-red-700">
                Confirm Account Deletion
              </h3>
              <p>
                Your account will be deleted, but any{" "}
                <b>content you&apos;ve created will remain</b> unless you delete
                such content individually. This is permanent -{" "}
                <b>your account cannot be recovered</b>, and future logins with
                the same email will create a new account.{" "}
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
        )}
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
      </>
    );
  }

  return (
    <Button onClick={toggleConfirming} style="delete" type="button">
      DELETE
    </Button>
  );
}
