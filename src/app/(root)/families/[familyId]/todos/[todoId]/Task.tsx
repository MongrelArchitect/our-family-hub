"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import userIcon from "@/assets/icons/user.svg";

import Loading from "@/components/Loading";

import { getUserInfo } from "@/lib/db/users";
import { toggleTaskDone } from "@/lib/db/todos";

import { TaskInterface } from "@/types/TodoList";
import { UserInterface } from "@/types/user";

interface Props {
  familyId: number;
  index: number;
  task: TaskInterface;
  todoId: number;
  userId: number;
}

interface TaskMembers {
  assignedTo: UserInterface | null;
  createdBy: UserInterface;
}

export default function Task({ familyId, index, task, todoId, userId }: Props) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<TaskMembers | null>(null);
  const [taskDone, setTaskDone] = useState(task.done);

  useEffect(() => {
    const getMemberInfo = async () => {
      try {
        let assignedTo: UserInterface | null = null;
        const createdBy = await getUserInfo(task.createdBy, familyId);
        if (task.assignedTo) {
          assignedTo = await getUserInfo(task.assignedTo, familyId);
        }
        setMemberInfo({
          assignedTo,
          createdBy,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getMemberInfo();
  }, []);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const toggleDone = async () => {
    try {
      setLoading(true);
      setTaskDone(!taskDone);
      await toggleTaskDone(familyId, todoId, task.id);
    } catch (err) {
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

  return (
    <>
      <tr
        className={`${index % 2 === 0 ? "bg-neutral-200" : ""} ${task.done && !loading ? "text-neutral-400 line-through" : ""} flex justify-between p-2`}
      >
        {loading ? (
          <td>
            <Loading />
          </td>
        ) : (
          <>
            <td>
              <button
                className="flex flex-wrap gap-2"
                onClick={toggleDetails}
                title="show details"
                type="button"
              >
                {task.title}
                <span
                  className={`${detailsVisible ? "" : "rotate-180 self-end"} origin-center text-sm transition-all`}
                >
                  ▲
                </span>
              </button>
            </td>
            <td>{task.dueBy?.toLocaleDateString() || "Whenever"}</td>
            <td className="flex-shrink-0">
              {memberInfo && memberInfo.assignedTo ? (
                <img
                  alt={memberInfo.assignedTo.name}
                  className="h-10 w-10 rounded-full"
                  src={memberInfo.assignedTo.image}
                  title={memberInfo.assignedTo.name}
                />
              ) : (
                <Image
                  className="h-10 w-10 rounded-full"
                  alt="Anyone"
                  src={userIcon}
                  title="Anyone"
                />
              )}
            </td>
            <td>
              <input
                checked={taskDone}
                className="scale-150"
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
        className={`${detailsVisible ? "" : "hidden"} ${index % 2 === 0 ? "bg-neutral-200" : ""}`}
      >
        <td
          className={`${task.done ? "text-neutral-400 line-through" : ""} col-span-3`}
        >
          <table className={loading ? "invisible" : ""}>
            <tbody>
              {task.details ? (
                <tr>
                  <th>Details:</th>
                  <td>{task.details}</td>
                </tr>
              ) : null}

              <tr>
                <th>Created by:</th>
                <td>{memberInfo ? memberInfo.createdBy.name : null}</td>
              </tr>
              <tr>
                <th>Created on:</th>
                <td>{task.createdAt.toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Assigned to:</th>
                <td>
                  {memberInfo && memberInfo.assignedTo
                    ? memberInfo?.assignedTo.name
                    : "Anyone"}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
}
