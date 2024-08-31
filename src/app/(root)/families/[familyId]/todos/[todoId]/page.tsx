import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import todoListIcon from "@/assets/icons/text-box.svg";

import Card from "@/components/Card";
import NewTaskForm from "./NewTaskForm";
import Task from "./Task";

import getUserId from "@/lib/auth/user";
import { getFamilyInfo } from "@/lib/db/families";
import { getTasks, getTodoListInfo } from "@/lib/db/todos";

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
  const userId = await getUserId();

  const familyId = +params.familyId;
  const todoId = +params.todoId;

  const todoListInfo = await getTodoListInfo(familyId, todoId);
  const tasks = await getTasks(familyId, todoId);
  const familyInfo = await getFamilyInfo(familyId);

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
                  userIsAdmin={userId === familyInfo.adminId}
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
      <Card
        borderColor="border-sky-400"
        flair={<Image alt="" className="p-2" src={todoListIcon} width={48} />}
        heading={todoListInfo.title}
        headingColor="bg-sky-200"
      >
        <div className="flex flex-col gap-4">
          {todoListInfo.description ? <p>{todoListInfo.description}</p> : null}
          {showTasks()}
          <NewTaskForm
            familyId={familyId}
            todoId={todoId}
            todoTitle={todoListInfo.title}
          />
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href={`/families/${familyId}`}
          >{`Back to The ${familyInfo.surname} Family`}</Link>
        </div>
      </Card>
    </main>
  );
}
