import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import triangleIcon from "@/assets/icons/triangle.svg";

import Button from "@/components/Button";
import Loading from "@/components/Loading";
import LocalTime from "@/components/LocalTime";
import ProfileImage from "@/components/ProfileImage";

import { deleteEvent } from "@/lib/db/events";
import { getOtherUsersInfo } from "@/lib/db/users";

import EventInterface from "@/types/Events";

interface Props {
  date: string;
  event: EventInterface;
  index: number;
  updateDate: (newDate: Date) => void;
  userId: number;
  userIsAdmin: boolean;
}

export default function Event({
  date,
  event,
  index,
  updateDate,
  userId,
  userIsAdmin,
}: Props) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [creatorName, setCreatorName] = useState("Family Member");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      const userInfo = await getOtherUsersInfo(event.createdBy);
      setCreatorName(userInfo.name);
    };
    getInfo();
  }, []);

  const toggleConfirmDelete = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const submitDelete = async () => {
    try {
      setError(null);
      setLoading(true);
      await deleteEvent(event.id, event.familyId);
      updateDate(new Date(date));
    } catch (err) {
      console.error("Error deleting event: ", err);
      setError("Error deleting event");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetailsVisible = () => {
    if (detailsVisible) {
      setConfirmingDelete(false);
    }
    setDetailsVisible(!detailsVisible);
  };

  const showConfirming = () => {
    return (
      <>
        <div className="p-2 text-red-700">
          Are you sure? <b>This cannot be undone!</b>
        </div>
        <Button
          extraClasses="m-2"
          style="cancel"
          onClick={toggleConfirmDelete}
          type="button"
        >
          CANCEL
        </Button>
        <Button
          extraClasses="m-2"
          style="submit"
          onClick={submitDelete}
          type="button"
        >
          CONFIRM
        </Button>
      </>
    );
  };

  const showDelete = () => {
    // only family admin or user who created the event can delete it
    if (userIsAdmin || userId === event.createdBy) {
      if (confirmingDelete) {
        return showConfirming();
      }
      return (
        <Button style="delete" onClick={toggleConfirmDelete} type="button">
          DELETE
        </Button>
      );
    }
    return null;
  };

  const showDetails = () => {
    if (loading && detailsVisible) {
      return (
        <div className="col-start-1 col-end-3 p-2">
          <Loading />
        </div>
      );
    }
    return (
      <div
        className={`${detailsVisible ? "max-h-[1000px]" : "max-h-0"} col-start-1 col-end-3 flex flex-col overflow-hidden text-base transition-[max-height] duration-300`}
        id={`event-${event.id}-details`}
      >
        {event.details ? (
          <pre className="whitespace-pre-wrap px-2 font-sans">
            {event.details}
          </pre>
        ) : null}

        <div className="flex items-center justify-between gap-2 px-2 pb-2 text-sm">
          <div className="flex flex-col">
            <span>
              Created by{" "}
              <Link
                className="font-bold text-violet-800 hover:underline focus:underline"
                href={`/users/${event.createdBy}`}
              >
                {creatorName}
              </Link>{" "}
              on {<LocalTime dateOnly timestampFromServer={event.createdAt} />}
            </span>
          </div>
          <ProfileImage size={32} userId={event.createdBy} />
        </div>
        {error ? (
          <div className="p-2 font-bold text-red-700">{error}</div>
        ) : null}
        {showDelete()}
      </div>
    );
  };

  return (
    <li
      className={`${index % 2 === 0 ? "bg-slate-300" : "bg-slate-200"} grid grid-cols-[112px_1fr] grid-rows-[auto_1fr] gap-2`}
    >
      <div className="p-2 font-mono text-base font-bold">
        {`${event.eventDate.toLocaleTimeString([], { timeStyle: "short" })}`}
      </div>

      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xl">{event.title}</div>
          <button
            aria-controls={`event-${event.id}-details`}
            aria-expanded={detailsVisible ? "true" : "false"}
            className="flex flex-wrap items-center gap-2"
            onClick={toggleDetailsVisible}
            title={`${detailsVisible ? "Hide" : "Show"} "${event.title}" details`}
            type="button"
          >
            <Image
              alt=""
              className={`${detailsVisible ? "" : "rotate-180"} transition-all`}
              src={triangleIcon}
              width={16}
            />
          </button>
        </div>
      </div>
      {showDetails()}
    </li>
  );
}
