"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import Loading from "@/components/Loading";

import { deleteFamily } from "@/lib/db/families";
import { deleteFamilyImage } from "@/lib/images/images";

interface Props {
  familyId: number;
  surname: string;
}

export default function DeleteForm({ familyId, surname }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [doubleChecked, setDoubleChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await deleteFamilyImage(familyId);
      await deleteFamily(familyId);
      router.push("/");
    } catch (err) {
      console.error("Error deleting family: ", err);
      setError("Error deleting family");
    } finally {
      setLoading(false);
    }
  };

  const handleFirstConfirm = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLInputElement;
    setConfirmed(target.checked);
    if (!target.checked && doubleChecked) {
      setDoubleChecked(false);
    }
  };

  const handleDoubleCheck = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLInputElement;
    setDoubleChecked(target.checked);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form className="flex flex-col gap-4" action={submit}>
      <div className="flex items-center gap-2">
        <input
          checked={confirmed}
          className="size-5 flex-shrink-0 accent-red-700"
          id="confirm-delete"
          onChange={handleFirstConfirm}
          type="checkbox"
        />
        <label htmlFor="confirm-delete">Confirm delete</label>
      </div>
      {confirmed ? (
        <div className="flex items-center gap-2">
          <input
            checked={doubleChecked}
            className="size-5 flex-shrink-0 accent-red-700"
            id="double-check"
            onChange={handleDoubleCheck}
            type="checkbox"
          />
          <label htmlFor="double-check">
            Double check - <b>no going back</b>
          </label>
        </div>
      ) : null}
      {doubleChecked ? (
        <div className="font-bold text-red-700">
          The {surname} Family will be permanently deleted once you click this
          button!
        </div>
      ) : null}
      {error ? <div className="font-bold text-red-700">{error}</div> : null}
      <Button
        disabled={!(confirmed && doubleChecked)}
        onClick={
          confirmed && doubleChecked
            ? undefined
            : () => {
                setError(
                  `Please check confirmation to delete The ${surname} Family`,
                );
              }
        }
        style="delete"
        type={confirmed && doubleChecked ? "submit" : "button"}
      >
        DELETE
      </Button>
    </form>
  );
}
