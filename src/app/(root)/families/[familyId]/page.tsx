import Image from "next/image";
import Link from "next/link";

import threadIcon from "@/assets/icons/thread.svg";
import todoListIcon from "@/assets/icons/todo-list.svg";

import Calendar from "./Calendar";
import Card from "@/components/Card";
import FamilyInfo from "./FamilyInfo";

import { getFamilyInfo } from "@/lib/db/families";
import getUserId from "@/lib/auth/user";
import { getThreadSummaries } from "@/lib/db/threads";
import { getTodoListSummaries } from "@/lib/db/todos";

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const familyId = +params.familyId;
  const family = await getFamilyInfo(familyId);

  if (!family) {
    return null;
  }

  const userId = await getUserId();
  const userIsAdmin = userId === family.adminId;
  const todoLists = await getTodoListSummaries(familyId);
  const threads = await getThreadSummaries(familyId);

  const showTodoListSummaries = () => {
    if (todoLists.length) {
      return (
        <ul className="flex flex-col gap-2">
          {todoLists.map((todoList) => {
            return (
              <li key={`todo-${todoList.id}`}>
                <Link
                  className="font-bold text-violet-800 hover:underline focus:underline"
                  href={`/families/${familyId}/todos/${todoList.id}`}
                  title={`View "${todoList.title}" todo list`}
                >
                  {todoList.title}
                </Link>{" "}
                ({todoList.taskCount} task{todoList.taskCount === 1 ? "" : "s"})
              </li>
            );
          })}
        </ul>
      );
    }
    return <p>No todo lists.</p>;
  };

  const showThreadSummaries = () => {
    if (threads.length) {
      return (
        <ul className="flex flex-col gap-2">
          {threads.map((thread) => {
            return (
              <li key={`thread-${thread.id}`}>
                <Link
                  className="font-bold text-violet-800 hover:underline focus:underline"
                  href={`/families/${familyId}/threads/${thread.id}`}
                  title={`View "${thread.title}" thread`}
                >
                  {thread.title}
                </Link>{" "}
                ({thread.postCount} post{thread.postCount === 1 ? "" : "s"})
              </li>
            );
          })}
        </ul>
      );
    }
    return <p>No discussion threads yet.</p>;
  };

  return (
    <div className="flex w-full flex-col gap-4 text-lg">
      <div className="flex gap-4 max-md:flex-col">
        <div className="flex w-full flex-col gap-4">
          {/* FAMILY INFO */}
          <FamilyInfo
            userId={userId}
            userIsAdmin={userIsAdmin}
            family={family}
          />

          {/* EVENT CALENDAR */}
          <div className="w-full md:hidden">
            <Calendar userId={userId} userIsAdmin={userIsAdmin} />
          </div>

          {/* TODO LISTS */}
          <Card
            borderColor="border-sky-400"
            flair={
              <Link
                className="rounded-full border-2 border-indigo-400 bg-neutral-100 hover:bg-indigo-300 focus:bg-indigo-300"
                href={`/families/${familyId}/todos/new`}
                title="Create new todo list"
              >
                <Image alt="" className="p-2" src={todoListIcon} width={40} />
              </Link>
            }
            heading="Todo Lists"
            headingColor="bg-sky-200"
          >
            {showTodoListSummaries()}
          </Card>

          {/* DISCUSSION THREADS */}
          <Card
            borderColor="border-teal-400"
            flair={
              <Link
                className="rounded-full border-2 border-indigo-400 bg-neutral-100 hover:bg-indigo-300 focus:bg-indigo-300"
                href={`/families/${familyId}/threads/new`}
                title="Create new discussion thread"
              >
                <Image alt="" className="p-2" src={threadIcon} width={40} />
              </Link>
            }
            heading="Discussion Threads"
            headingColor="bg-teal-200"
          >
            {showThreadSummaries()}
          </Card>
        </div>
        {/* EVENT CALENDAR */}
        <div className="w-full max-md:hidden">
          <Calendar userId={userId} userIsAdmin={userIsAdmin} />
        </div>
      </div>
    </div>
  );
}
