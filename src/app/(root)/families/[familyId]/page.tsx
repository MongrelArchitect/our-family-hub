import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import starIcon from "@/assets/icons/star.svg";
import { auth } from "@/auth";
import Card from "@/components/Card";
import { getFamilyInfo, getFamilySurname } from "@/lib/db/families";
import { getTodoListSummaries } from "@/lib/db/todos";

export async function generateMetadata({
  params,
}: {
  params: { familyId: string };
}): Promise<Metadata> {
  const familyId = +params.familyId;
  let familyName = "My Family";
  try {
    const surname = await getFamilySurname(familyId);
    familyName = `The ${surname} Family`;
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error("Error getting family surname for page title: ", err);
  }

  return {
    title: familyName,
  };
}

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
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
  const family = await getFamilyInfo(familyId);
  const userIsAdmin = userId === family.adminId;
  const todoLists = await getTodoListSummaries(familyId);

  const showTodoListSummaries = () => {
    if (todoLists.length) {
      return (
        <ul>
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

  return (
    <main className="flex flex-col gap-4 p-2 text-lg">
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
          <span className="font-mono">{family.memberCount}</span>
        </p>
        <p>Admin: {userIsAdmin ? "You" : family.adminName}</p>
      </Card>
      <Card heading="Todo Lists" headingColor="bg-emerald-200">
        {showTodoListSummaries()}
      </Card>
    </main>
  );
}
