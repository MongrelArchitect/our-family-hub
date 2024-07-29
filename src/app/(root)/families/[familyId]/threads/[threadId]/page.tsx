import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Card from "@/components/Card";
import { getFamilyInfo } from "@/lib/db/families";
import { getUserInfo } from "@/lib/auth/user";

interface Params {
  params: {
    familyId: string;
    todoId: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  let title = "Thread";
  try {
    const familyId = +params.familyId;
  } catch (err) {
    console.error("Error getting thread info for page title: ", err);
  }

  return {
    title,
  };
}

export default async function Thread({ params }: Params) {
  const user = await getUserInfo();
  if (!user) {
    redirect("/landing");
  }
  const userId = user.id;

  const familyId = +params.familyId;
  const todoId = +params.todoId;

  const familyInfo = await getFamilyInfo(familyId);

  return (
    <main className="p-2 text-lg">
      <Card heading="Todo List" headingColor="bg-emerald-200">
        rable
      </Card>
    </main>
  );
}
