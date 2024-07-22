import { Metadata } from "next";

import { auth } from "@/auth";

import Card from "@/components/Card";

import { getTasks, getTodoListInfo } from "@/lib/db/todos";

import NewTaskForm from "./NewTaskForm";
import Task from "./Task";

interface Params {
  params: {
    familyId: string;
    todoId: string;
  };
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const familyId = +params.familyId;
  const todoId = +params.todoId;
  const todoListInfo = await getTodoListInfo(familyId, todoId);
  const title = todoListInfo.title;
  try {
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error getting tody list info for page title: ", err);
  }

  return {
    title,
  };
}

export default async function TodoList({ params }: Params) {
  // ===================================
  // middleware handles redirect for non-auth users
  // this is to make typescript happy ¯\_(ツ)_/¯
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const { user } = session;
  if (!user.id) {
    return null;
  }
  // ===================================
  const userId = +user.id;

  const familyId = +params.familyId;
  const todoId = +params.todoId;

  const todoListInfo = await getTodoListInfo(familyId, todoId);
  const tasks = await getTasks(familyId, todoId);

  const showTasks = () => {
    if (tasks.length) {
      return (
        <table className="flex flex-col text-base lg:text-lg">
          <thead>
            <tr className="flex justify-between border-b-2 border-neutral-400">
              <th>Title</th>
              <th>Due</th>
              <th>Assigned to</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody className="flex flex-col">
            {tasks.map((task, index) => {
              return (
                <Task
                  familyId={familyId}
                  index={index}
                  key={task.id}
                  task={task}
                  todoId={todoId}
                  userId={userId}
                />
              );
            })}
          </tbody>
        </table>
      );
    }
    return <p>No tasks to show. Start adding some!</p>;
  };

  return (
    <main className="p-2 text-lg">
      <Card heading={todoListInfo.title} headingColor="bg-emerald-200">
        <NewTaskForm
          familyId={familyId}
          todoId={todoId}
          todoTitle={todoListInfo.title}
        />
        {todoListInfo.description ? <p>{todoListInfo.description}</p> : null}
        {showTasks()}
      </Card>
    </main>
  );
}
