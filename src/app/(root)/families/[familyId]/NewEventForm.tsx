import { useParams } from "next/navigation";
import { useRef, useState } from "react";

import Input from "@/components/Input";
import Loading from "@/components/Loading";
import TextArea from "@/components/TextArea";

import { createNewEvent } from "@/lib/db/events";

interface Props {
  date: string;
  toggleFormVisible: () => void;
  updateDate: (newDate: Date) => void;
  visible: boolean;
}

export default function NewEventForm({
  date,
  toggleFormVisible,
  updateDate,
  visible,
}: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const { familyId } = useParams<{ familyId: string }>();

  const checkFormValidity = () => {
    const validTitle = titleRef.current?.validity.valid || false;
    const validDescription = descriptionRef.current?.validity.valid || false;
    const validTime = timeRef.current?.validity.valid || false;
    return validTitle && validDescription && validTime;
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    if (checkFormValidity()) {
      try {
        setLoading(true);
        await createNewEvent(formData, +familyId);
        updateDate(new Date(date));
        toggleFormVisible();
      } catch (err) {
        console.error("Error creating new event: ", err);
        setError("Error creating new event");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form action={submit} className="flex flex-col gap-2" noValidate>
      <h3 className="text-xl font-bold">New Event</h3>
      <Input
        attempted={attempted}
        errorText="Title required"
        id="event-title"
        labelText="Title"
        maxLength={255}
        ref={titleRef}
        required
        tabIndex={visible ? 0 : -1}
        type="text"
      />
      <TextArea
        attempted={attempted}
        errorText="Invalid details"
        id="event-details"
        labelText="Details (optional)"
        maxLength={1000}
        ref={descriptionRef}
        tabIndex={visible ? 0 : -1}
      />
      <Input
        attempted={attempted}
        errorText="Time required"
        id="event-time"
        labelText="Time"
        ref={timeRef}
        required
        tabIndex={visible ? 0 : -1}
        type="time"
      />
      <input
        aria-hidden="true"
        id="event-date"
        name="event-date"
        type="hidden"
        value={date}
      />
      <input
        aria-hidden="true"
        id="event-offset"
        name="event-offset"
        type="hidden"
        value={new Date().getTimezoneOffset()}
      />
      {error ? <div className="text-red-700">{error}</div> : null}
      {loading ? (
        <Loading />
      ) : (
        <button
          className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
          tabIndex={visible ? 0 : -1}
          type="submit"
        >
          Submit
        </button>
      )}
      <button
        className="bg-rose-200 p-2 hover:bg-rose-300 focus:bg-rose-300"
        onClick={toggleFormVisible}
        tabIndex={visible ? 0 : -1}
        type="button"
      >
        Cancel
      </button>
    </form>
  );
}
