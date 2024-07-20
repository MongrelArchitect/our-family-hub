"use client";
import { useState } from "react";

import { TaskInterface } from "@/types/TodoList";

interface Props {
  index: number;
  task: TaskInterface;
}

export default function Task({ index, task }: Props) {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  return (
    <>
    <tr
      className={`${index % 2 === 0 ? "bg-neutral-200" : ""} flex justify-between p-2`}
    >
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
      <td>{task.assignedTo ? task.assignedTo : "Anyone"}</td>
      <td>
        <form>
          <input className="scale-150" type="checkbox" />
        </form>
      </td>
    </tr>
      <tr className={`${detailsVisible ? "" : "hidden"} ${index % 2 === 0 ? "bg-neutral-200" : ""}`}>
        <td className="col-span-3">
          <table>
            <tbody>

              {task.details ? 
              <tr>
                <th>Details:</th>
                <td>
                  {task.details}
                </td>
              </tr>
              : null}

              <tr>
                <th>Created by:</th>
                <td>{task.createdBy}</td>
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
