"use client";
import { useEffect, useState } from "react";

import Loading from "@/components/Loading";

import { getUserInfo } from "@/lib/db/users";

import { TaskInterface } from "@/types/TodoList";
import { UserInterface } from "@/types/user";

interface Props {
  familyId: number;
  index: number;
  task: TaskInterface;
}

interface TaskMembers {
  assignedTo: UserInterface | null;
  createdBy: UserInterface;
}

export default function Task({ familyId, index, task }: Props) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<TaskMembers | null>(null);

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

  return (
    <>
      <tr
        className={`${index % 2 === 0 ? "bg-neutral-200" : ""} flex justify-between p-2`}
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
            <td>
              {memberInfo && memberInfo.assignedTo
                ? memberInfo.assignedTo.name
                : "Anyone"}
            </td>
            <td>
              <form>
                <input className="scale-150" type="checkbox" />
              </form>
            </td>
          </>
        )}
      </tr>
      <tr
        className={`${detailsVisible ? "" : "hidden"} ${index % 2 === 0 ? "bg-neutral-200" : ""}`}
      >
        <td className="col-span-3">
          <table>
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
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
}
