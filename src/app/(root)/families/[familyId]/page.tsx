import Image from "next/image";
import Link from "next/link";

import editIcon from "@/assets/icons/home-edit.svg";
import inviteIcon from "@/assets/icons/account-plus.svg";
import removeIcon from "@/assets/icons/account-cancel.svg";
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

  const showAdminControls = () => {
    return (
      <div className="flex flex-wrap gap-6">
        <Link
          className="rounded-full border-2 border-amber-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${familyId}/invite`}
          title="Invite new member to family"
        >
          <Image alt="" className="p-2" src={inviteIcon} width={48} />
        </Link>
        <Link
          className="rounded-full border-2 border-amber-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${familyId}/remove`}
          title="Remove member from family"
        >
          <Image alt="" className="p-2" src={removeIcon} width={48} />
        </Link>
        <Link
          className="rounded-full border-2 border-amber-400 bg-amber-200 hover:bg-amber-300 focus:bg-amber-300"
          href={`/families/${familyId}/edit`}
          title="Edit family info"
        >
          <Image alt="" className="p-2" src={editIcon} width={48} />
        </Link>
      </div>
    );
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
        <div className="flex flex-col gap-2">
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
          {userIsAdmin ? showAdminControls() : null}
        </div>
      </Card>

      <div className="flex grid-cols-2 grid-rows-[auto_1fr] flex-col gap-2 md:grid">
        {/* TODO LISTS */}
        <Card
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
          headingColor="bg-emerald-200"
        >
          {showTodoListSummaries()}
        </Card>

        {/* DISCUSSION THREADS */}
        <Card
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
