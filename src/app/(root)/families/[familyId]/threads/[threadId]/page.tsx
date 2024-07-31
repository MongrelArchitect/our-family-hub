import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Card from "@/components/Card";
import LocalTime from "@/components/LocalTime";
import NewPostForm from "./NewPostForm";
import { getUserInfo } from "@/lib/auth/user";
import { getFamilyInfo } from "@/lib/db/families";
import { getThreadInfo } from "@/lib/db/threads";
import { getUserInfo as getAuthorInfo } from "@/lib/db/users";

interface Params {
  params: {
    familyId: string;
    threadId: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  let title = "Thread";
  try {
    const familyId = +params.familyId;
    const threadId = +params.threadId;
    const threadInfo = await getThreadInfo(threadId, familyId);
    title = threadInfo.title;
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
  const familyId = +params.familyId;
  const threadId = +params.threadId;

  const familyInfo = await getFamilyInfo(familyId);
  const threadInfo = await getThreadInfo(threadId, familyId);
  const authorInfo = await getAuthorInfo(threadInfo.authorId, familyId);

  return (
    <main className="p-2 text-lg">
      <Card
        flair={`${threadInfo.postCount} post${threadInfo.postCount === 1 ? "" : "s"}`}
        heading={threadInfo.title}
        headingColor="bg-emerald-200"
      >
        <div className="flex flex-col gap-4">
          <pre className="whitespace-pre-wrap font-sans">
            {threadInfo.content}
          </pre>
          <div className="flex flex-wrap items-center gap-2">
            <img
              alt=""
              className="h-8 w-8 rounded-full"
              referrerPolicy="no-referrer"
              src={authorInfo.image}
            />
            <div className="flex flex-col font-mono text-sm">
              <span>{authorInfo.name}</span>
              <span>
                <LocalTime timestampFromServer={threadInfo.createdAt} />
              </span>
            </div>
          </div>
          <NewPostForm familyId={familyId} threadId={threadId} />
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href={`/families/${familyId}`}
          >
            {`Back to The ${familyInfo.surname} Family`}
          </Link>
        </div>
      </Card>
    </main>
  );
}
