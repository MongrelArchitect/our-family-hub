import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import threadIcon from "@/assets/icons/chat.svg";

import Card from "@/components/Card";
import DeleteThread from "./DeleteThread";
import LocalTime from "@/components/LocalTime";
import ProfileImage from "@/components/ProfileImage";

import NewPostForm from "./NewPostForm";
import Post from "./Post";

import getUserId from "@/lib/auth/user";
import { getFamilyInfo } from "@/lib/db/families";
import { getThreadInfo, getThreadPosts } from "@/lib/db/threads";
import { getOtherUsersInfo as getAuthorInfo } from "@/lib/db/users";

import UserInterface from "@/types/Users";

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
  const userId = await getUserId();

  const familyId = +params.familyId;
  const threadId = +params.threadId;

  const familyInfo = await getFamilyInfo(familyId);
  const threadInfo = await getThreadInfo(threadId, familyId);
  const authorInfo = await getAuthorInfo(threadInfo.authorId);

  const posts = await getThreadPosts(familyId, threadId);

  const userIsAdmin = userId === familyInfo.adminId;
  const userIsThreadAuthor = userId === threadInfo.authorId;

  return (
    <div className="flex flex-col gap-4">
      <Card
        borderColor="border-teal-400"
        flair={
          <div className="relative">
            <Image alt="" className="p-2" src={threadIcon} width={48} />
            <span className="absolute left-[19px] top-[13px] font-mono text-sm text-white">
              {threadInfo.postCount}
            </span>
          </div>
        }
        heading={threadInfo.title}
        headingColor="bg-teal-200"
      >
        <div className="flex flex-col gap-4">
          <pre className="whitespace-pre-wrap font-sans">
            {threadInfo.content}
          </pre>
          <div className="flex flex-wrap items-center gap-2">
            <ProfileImage size={40} userId={authorInfo.id} />
            <div className="flex flex-col font-mono text-sm">
              {authorInfo.id === 1 ? (
                authorInfo.name
              ) : (
                <Link
                  className="font-bold text-violet-800 hover:underline focus:underline"
                  href={`/users/${threadInfo.authorId}`}
                  title={`View ${authorInfo.name}'s profile`}
                >
                  {authorInfo.name}
                </Link>
              )}
              <span>
                <LocalTime timestampFromServer={threadInfo.createdAt} />
              </span>
            </div>
          </div>
          <NewPostForm familyId={familyId} threadId={threadId} />
          {userIsAdmin || userIsThreadAuthor ? (
            <DeleteThread familyId={familyId} threadId={threadId} />
          ) : null}
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href={`/families/${familyId}`}
          >
            {`Back to The ${familyInfo.surname} Family`}
          </Link>
        </div>
      </Card>
      {posts.map((post) => {
        return (
          <Post
            familyId={familyId}
            key={`post-${post.id}`}
            post={post}
            userIsAdmin={userIsAdmin}
            userIsPostAuthor={userId === post.authorId}
          />
        );
      })}
    </div>
  );
}
