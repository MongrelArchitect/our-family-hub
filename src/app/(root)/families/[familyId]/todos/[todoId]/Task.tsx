"use client";
import { useEffect, useState } from "react";

import Loading from "@/components/Loading";

import { getUserInfo } from "@/lib/db/users";
import { toggleTaskDone } from "@/lib/db/todos";

import { TaskInterface } from "@/types/TodoList";
import UserInterface from "@/types/Users";

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
        className={`${index % 2 === 0 ? "bg-neutral-200" : ""} ${task.done && !loading ? "text-neutral-400 line-through" : ""}`}
      >
        {loading ? (
          <td colSpan={3}>
            <Loading />
          </td>
        ) : (
          <>
            <td className="p-2">
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
            <td className="p-2">
              {task.dueBy?.toLocaleDateString() || "Whenever"}
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
        className={`${detailsVisible ? "" : "hidden"} ${index % 2 === 0 ? "bg-neutral-200" : ""}`}
      >
        <td
          className={`${task.done ? "text-neutral-400 line-through" : ""}`}
          colSpan={3}
        >
          <table className={loading ? "invisible" : ""}>
            <tbody>
              {task.details ? (
                <tr>
                  <th align="left">Details:</th>
                  <td align="left" className="pl-2">
                    {task.details}
                  </td>
                </tr>
              ) : null}

              <tr>
                <th align="left">Created by:</th>
                <td align="left" className="pl-2">
                  {memberInfo ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {memberInfo?.createdBy.name}
                      <img
                        alt={memberInfo.createdBy.name}
                        className={`${task.done ? "opacity-30 grayscale" : ""} h-8 w-8 rounded-full`}
                        src={memberInfo.createdBy.image}
                        title={memberInfo.createdBy.name}
                      />
                    </div>
                  ) : null}
                </td>
              </tr>
              <tr>
                <th align="left">Created on:</th>
                <td align="left" className="pl-2">
                  {task.createdAt.toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <th align="left">Assigned to:</th>
                <td align="left" className="pl-2">
                  {memberInfo && memberInfo.assignedTo ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {memberInfo?.assignedTo.name}
                      <img
                        alt={memberInfo.assignedTo.name}
                        className={`${task.done ? "opacity-30 grayscale" : ""} h-8 w-8 rounded-full`}
                        src={memberInfo.assignedTo.image}
                        title={memberInfo.assignedTo.name}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      Anyone
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
}
