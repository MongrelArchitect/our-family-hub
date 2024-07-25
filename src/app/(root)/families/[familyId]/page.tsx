import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import starIcon from "@/assets/icons/star.svg";
import Card from "@/components/Card";
import { getFamilyInfo } from "@/lib/db/families";
import { getUserInfo } from "@/lib/auth/user";
import { getTodoListSummaries } from "@/lib/db/todos";

export default async function FamilyPage({
  params,
}: {
  params: { familyId: string };
}) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }

  const familyId = +params.familyId;
  const family = await getFamilyInfo(familyId);
  const userIsAdmin = user.id === family.adminId;
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
