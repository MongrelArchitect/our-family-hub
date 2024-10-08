"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import newTaskIcon from "@/assets/icons/invoice-text-plus.svg";

import Button from "@/components/Button";
import Card from "@/components/Card";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import ProfileImage from "@/components/ProfileImage";

import { getFamilyMembers } from "@/lib/db/families";
import { createNewTask } from "@/lib/db/todos";

import UserInterface from "@/types/Users";

interface Props {
  familyId: number;
  todoId: number;
  todoTitle: string;
}

export default function NewTaskForm({ familyId, todoId, todoTitle }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const dueRef = useRef<HTMLInputElement>(null);
  const assignedRef = useRef<HTMLSelectElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberChanged, setMemberChanged] = useState(false);
  const [memberInfo, setMemberInfo] = useState<UserInterface | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        setLoading(true);
        setFamilyMembers(await getFamilyMembers(familyId));
        setLoading(false);
      } catch (err) {
        console.error("Error getting family members: ", err);
        setError("Error getting family members");
      }
    };
    loadInfo();
  }, []);

  const clearForm = () => {
    setAttempted(false);
    setError(null);
    setLoading(false);
    setMemberInfo(null);
    formRef.current?.reset();
  };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const showMemberInfo = () => {
    if (memberInfo) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ProfileImage
              reloadTrigger={memberChanged}
              size={72}
              userId={memberInfo.id}
            />
            <div className="break-all">
              <p>{memberInfo.name}</p>
              <p>{memberInfo.email}</p>
              <p>{`Member since ${memberInfo.createdAt.toLocaleDateString()}`}</p>
              <p>{`Last login ${memberInfo.lastLoginAt.toLocaleDateString()}`}</p>
            </div>
          </div>
          <button
            className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
            onClick={() => {
              setMemberInfo(null);
            }}
          >
            Clear member
          </button>
        </div>
      );
    }
    return null;
  };

  const chooseMember = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLSelectElement;
    const memberToShow = familyMembers.find((member) => {
      return member.id === +target.value;
    });
    if (memberToShow) {
      setMemberChanged(!memberChanged);
      setMemberInfo(memberToShow);
    }
  };

  const checkFormValidity = () => {
    const validTitle = titleRef.current?.validity.valid;
    const validDetails = detailsRef.current?.validity.valid;
    const validDue = dueRef.current?.validity.valid;
    const validAssigned = assignedRef.current?.validity.valid;
    return validTitle && validDetails && validDue && validAssigned;
  };

  const submit = async (formData: FormData) => {
    setAttempted(true);
    if (checkFormValidity()) {
      try {
        setLoading(true);
        // need to get the user's timezone offset to convert to UTC in the db
        const due = dueRef.current?.value;
        let offset: number | null = null;
        if (due) {
          offset = new Date(due).getTimezoneOffset();
        }
        await createNewTask(familyId, todoId, offset, formData);
        clearForm();
        toggleVisible();
      } catch (err) {
        setError("Error submitting new task");
        console.error("Error submitting new task: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const showForm = () => {
    return (
      <div
        aria-hidden={visible}
        className={`${visible ? null : "pointer-events-none opacity-0"} fixed left-0 top-0 z-10 flex h-screen w-full flex-col items-center bg-neutral-600/20 backdrop-blur-sm transition-all`}
        id="grayout"
        onClick={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLDivElement;
          // prevent visibility toggling due to clicks bubbling up from input
          if (target.id === "grayout") {
            toggleVisible();
            clearForm();
          }
        }}
      >
        <div
          className={`${visible ? "" : "-translate-y-full"} w-full max-w-[500px] transition-all`}
        >
          <Card
            borderColor="border-sky-400"
            flair={
              <Image alt="" className="p-2" src={newTaskIcon} width={48} />
            }
            heading="New Task"
            headingColor="bg-sky-200"
          >
            {loading ? (
              <Loading />
            ) : (
              <form
                action={submit}
                className="flex flex-col gap-4"
                id="new-task-form"
                noValidate
                ref={formRef}
              >
                <div>
                  <span>Create new task for</span>
                  <span className="font-bold">{` ${todoTitle}`}</span>
                </div>
                <Input
                  attempted={attempted}
                  clearTrigger={visible}
                  errorText="Title required"
                  id="title"
                  labelText="Title"
                  maxLength={255}
                  ref={titleRef}
                  required
                  tabIndex={visible ? 0 : -1}
                  type="text"
                />

                <Input
                  attempted={attempted}
                  clearTrigger={visible}
                  id="details"
                  labelText="Details (optional)"
                  maxLength={255}
                  ref={detailsRef}
                  tabIndex={visible ? 0 : -1}
                  type="text"
                />

                <DatePicker
                  attempted={attempted}
                  id={"due"}
                  labelText="Due date (optional)"
                  ref={dueRef}
                  tabIndex={visible ? 0 : -1}
                />

                <div className="flex flex-col gap-1">
                  <label htmlFor="members">Assigned member (optional)</label>
                  {showMemberInfo()}
                  <select
                    className="border-2 border-neutral-600 bg-neutral-50 p-2 hover:outline hover:outline-slate-600 focus:outline focus:outline-slate-600"
                    name="assigned"
                    onChange={chooseMember}
                    id="assigned"
                    ref={assignedRef}
                    value={memberInfo ? memberInfo.id : 0}
                  >
                    <option value={0} disabled>
                      Choose a member
                    </option>
                    {familyMembers.map((member) => {
                      return (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {error ? <div className="text-red-700">{error}</div> : null}

                <Button
                  ariaHidden={!visible}
                  tabIndex={visible ? 0 : -1}
                  style="submit"
                  type="submit"
                >
                  SUBMIT
                </Button>

                <Button
                  ariaHidden={!visible}
                  ariaControls="new-task-form"
                  ariaExpanded={visible}
                  onClick={() => {
                    toggleVisible();
                    clearForm();
                  }}
                  style="cancel"
                  tabIndex={visible ? 0 : -1}
                  type="button"
                >
                  CANCEL
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    );
  };

  return (
    <>
      {showForm()}
      <div className="flex flex-col">
        <Button
          ariaHidden={visible}
          ariaControls="new-task-form"
          ariaExpanded={visible}
          style="add"
          onClick={toggleVisible}
          type="button"
        >
          NEW TASK
        </Button>
      </div>
    </>
  );
}
