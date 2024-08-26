import Image from "next/image";
import Link from "next/link";

import starIcon from "@/assets/icons/star.svg";
import threadIcon from "@/assets/icons/thread.svg";
import todoListIcon from "@/assets/icons/todo-list.svg";
import Calendar from "./Calendar";
import Card from "@/components/Card";
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
    return <p>No todo lists.</p>;
  };

  return (
    <main className="flex flex-col gap-4 p-2 text-lg">
      {/* FAMILY INFO */}
      <Card
        flair={
          userIsAdmin ? (
            <Image alt="admin" src={starIcon} title="admin" />
          ) : null
        }
        heading={`The ${family.surname} Family`}
        headingColor="bg-emerald-200"
      >
        <p>
          <span>Members: </span>
          <span className="font-mono">
            <Link
              className="font-bold text-violet-800 hover:underline focus:underline"
              href={`/families/${familyId}/members`}
              title="View members"
            >
              {family.memberCount}
            </Link>
          </span>
        </p>
        <p>
          Admin:{" "}
          {userIsAdmin ? (
            <Link
              className="font-bold text-violet-800 hover:underline focus:underline"
              href={`/users/${userId}`}
              title="View your profile"
            >
              You
            </Link>
          ) : (
            <Link
              className="font-bold text-violet-800 hover:underline focus:underline"
              href={`/users/${family.adminId}`}
              title={`View ${family.adminName}'s profile`}
            >
              {family.adminName}
            </Link>
          )}
        </p>
      </Card>

      <div className="flex grid-cols-2 grid-rows-[auto_1fr] flex-col gap-2 md:grid">
        {/* TODO LISTS */}
        <Card
          flair={<Image alt="" src={todoListIcon} />}
          heading="Todo Lists"
          headingColor="bg-emerald-200"
        >
          {showTodoListSummaries()}
        </Card>

        {/* DISCUSSION THREADS */}
        <Card
          flair={<Image alt="" src={threadIcon} />}
          heading="Discussion Threads"
          headingColor="bg-emerald-200"
        >
          {showThreadSummaries()}
        </Card>

        {/* EVENT CALENDAR */}
        <Calendar />
      </div>
    </main>
  );
}
