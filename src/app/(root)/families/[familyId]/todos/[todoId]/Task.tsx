"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import triangleIcon from "@/assets/icons/triangle.svg";

import Loading from "@/components/Loading";
import ProfileImage from "@/components/ProfileImage";

import { getOtherUsersInfo } from "@/lib/db/users";
import { deleteTask, toggleTaskDone } from "@/lib/db/todos";

import { TaskInterface } from "@/types/TodoList";
import UserInterface from "@/types/Users";

interface Props {
  familyId: number;
  index: number;
  task: TaskInterface;
  todoId: number;
  userId: number;
  userIsAdmin: boolean;
}

interface TaskMembers {
  assignedTo: UserInterface | null;
  createdBy: UserInterface;
}

export default function Task({
  familyId,
  index,
  task,
  todoId,
  userId,
  userIsAdmin,
}: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<TaskMembers | null>(null);
  const [onClient, setOnClient] = useState(false);
  const [taskDone, setTaskDone] = useState(task.done);

  useEffect(() => {
    const getMemberInfo = async () => {
      try {
        let assignedTo: UserInterface | null = null;
        const createdBy = await getOtherUsersInfo(task.createdBy);
        if (task.assignedTo) {
          assignedTo = await getOtherUsersInfo(task.assignedTo);
        }
        setMemberInfo({
          assignedTo,
          createdBy,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setOnClient(true); // prevent client not matching server rendered html
      }
    };
    getMemberInfo();
  }, []);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
    setConfirmingDelete(false);
  };

  const toggleDone = async () => {
    try {
      setLoading(true);
      setTaskDone(!taskDone);
      await toggleTaskDone(familyId, todoId, task.id);
    } catch (err) {
      // XXX TODO XXX
      // display error somewhere
      console.error("Error toggling task done: ", err);
    } finally {
      setLoading(false);
    }
  };

  const setDoneTitle = () => {
    if (task.assignedTo && task.assignedTo !== userId) {
      if (memberInfo && memberInfo.assignedTo) {
        return `Task is for ${memberInfo.assignedTo.name} only`;
      }
      return "Task assigned to another member";
    }
    return `Mark task as ${task.done ? "not" : ""} done`;
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteTask(familyId, todoId, task.id);
    } catch (err) {
      // XXX TODO XXX
      // display error somewhere
      console.error("Error deleting task: ", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDelete = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const showDeleteButton = () => {
    // only allow the user who created the task (or family admin) to delet it
    if (userIsAdmin || userId === task.createdBy) {
      return (
        <div className="flex flex-col gap-2">
          {confirmingDelete ? (
            <>
              <p className="text-red-700">
                Are you sure? <b>This cannot be undone!</b>
              </p>
              <button
                className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
                onClick={toggleDelete}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-rose-300 p-2 hover:bg-rose-400 focus:bg-rose-400"
                onClick={confirmDelete}
                type="button"
              >
                Confirm Delete
              </button>
            </>
          ) : (
            <button
              className="bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
              onClick={toggleDelete}
              type="button"
            >
              Delete Task
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <tr className={`${index % 2 === 0 ? "bg-stone-200" : "bg-stone-300"}`}>
        {loading ? (
          <td colSpan={3}>
            <Loading />
          </td>
        ) : (
          <>
            <td
              className={`${task.done && !loading ? "text-neutral-400 line-through" : ""} p-2`}
            >
              <button
                aria-controls={`task-${task.id}-details`}
                aria-expanded={detailsVisible ? "true" : "false"}
                className="flex flex-wrap items-center gap-2"
                onClick={toggleDetails}
                title="show details"
                type="button"
              >
                {task.title}
                <Image
                  alt=""
                  className={`${detailsVisible ? "" : "rotate-180"} ${task.done ? "opacity-30 grayscale" : ""} transition-all`}
                  src={triangleIcon}
                  width={12}
                />
              </button>
            </td>
            <td
              className={`${task.done && !loading ? "text-neutral-400 line-through" : ""} p-2`}
            >
              {(onClient && task.dueBy?.toLocaleDateString()) || "Whenever"}
            </td>
            <td className="p-2">
              <input
                checked={taskDone}
                className="scale-150 accent-indigo-500 disabled:opacity-60"
                disabled={task.assignedTo ? task.assignedTo !== userId : false}
                onChange={toggleDone}
                title={setDoneTitle()}
                type="checkbox"
              />
            </td>
          </>
        )}
      </tr>
      <tr
        className={`${detailsVisible ? "" : "hidden"} ${index % 2 === 0 ? "bg-stone-200" : "bg-stone-300"}`}
        id={`task-${task.id}-details`}
      >
        <td colSpan={3}>
          <div
            className={`${loading ? "invisible" : ""} flex flex-col gap-2 p-4`}
          >
            {task.details ? (
              <div
                className={`${task.done ? "text-neutral-400 line-through" : ""}`}
              >
                <h3 className="font-bold">Details:</h3>
                <p>{task.details}</p>
              </div>
            ) : null}

            <div
              className={`${task.done ? "text-neutral-400 line-through" : ""}`}
            >
              <h3 className="font-bold">Created by:</h3>
              <div>
                {memberInfo ? (
                  <p className="flex flex-wrap items-center gap-2">
                    <Link
                      className={`font-bold ${task.done ? "text-neutral-400" : "text-violet-800"} hover:underline focus:underline`}
                      href={`/users/${task.createdBy}/`}
                      title={`View ${memberInfo?.createdBy.name}'s profile`}
                    >
                      {memberInfo?.createdBy.name}
                    </Link>
                    <ProfileImage 
                      extraClasses={`${task.done ? "opacity-30 grayscale" : ""}`}
                      size={40}
                      userId={memberInfo.createdBy.id}
                    />
                  </p>
                ) : null}
              </div>
            </div>
            <div
              className={`${task.done ? "text-neutral-400 line-through" : ""}`}
            >
              <h3 className="font-bold">Created on:</h3>
              <p>{onClient ? task.createdAt.toLocaleDateString() : ""}</p>
            </div>
            <div
              className={`${task.done ? "text-neutral-400 line-through" : ""}`}
            >
              <h3 className="font-bold">Assigned to:</h3>
              <div>
                {memberInfo && memberInfo.assignedTo ? (
                  <p className="flex flex-wrap items-center gap-2">
                    <Link
                      className={`font-bold ${task.done ? "text-neutral-400" : "text-violet-800"} hover:underline focus:underline`}
                      href={`/users/${task.assignedTo}/`}
                      title={`View ${memberInfo?.assignedTo.name}'s profile`}
                    >
                      {memberInfo?.assignedTo.name}
                    </Link>
                    <ProfileImage 
                      extraClasses={`${task.done ? "opacity-30 grayscale" : ""}`}
                      size={40}
                      userId={memberInfo.assignedTo.id}
                    />
                  </p>
                ) : (
                  <p className="flex flex-wrap items-center gap-2">Anyone</p>
                )}
              </div>
            </div>
            {showDeleteButton()}
          </div>
        </td>
      </tr>
    </>
  );
}
