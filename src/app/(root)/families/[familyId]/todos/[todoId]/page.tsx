import { Metadata } from "next";
import { redirect } from "next/navigation";

import Card from "@/components/Card";
import { getTasks, getTodoListInfo } from "@/lib/db/todos";
import { getUserInfo } from "@/lib/auth/user";

import NewTaskForm from "./NewTaskForm";
import Task from "./Task";

interface Params {
  params: {
    familyId: string;
    todoId: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  let title = "Todo List";
  try {
    const familyId = +params.familyId;
    const todoId = +params.todoId;
    const todoListInfo = await getTodoListInfo(familyId, todoId);
    title = todoListInfo.title;
  } catch (err) {
    console.error("Error getting todo list info for page title: ", err);
  }

  return {
    title,
  };
}

export default async function TodoList({ params }: Params) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }
  const userId = user.id;

  const familyId = +params.familyId;
  const todoId = +params.todoId;

  const todoListInfo = await getTodoListInfo(familyId, todoId);
  const tasks = await getTasks(familyId, todoId);

  const showTasks = () => {
    if (tasks.length) {
      return (
        <table className="w-full">
          <thead className="text-left">
            <tr className="border-b-2 border-neutral-400 p-2">
              <th>Title</th>
              <th>Due</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
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
        <div className="flex flex-col gap-4">
          {todoListInfo.description ? <p>{todoListInfo.description}</p> : null}
          {showTasks()}
          <NewTaskForm
            familyId={familyId}
            todoId={todoId}
            todoTitle={todoListInfo.title}
          />
        </div>
      </Card>
    </main>
  );
}
