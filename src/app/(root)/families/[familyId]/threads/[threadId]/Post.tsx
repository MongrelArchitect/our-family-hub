import Link from "next/link";
import { PostInterface } from "@/types/Threads";
import { getOtherUsersInfo as getAuthorInfo } from "@/lib/db/users";

import DeletePost from "./DeletePost";
import Loading from "@/components/Loading";
import LocalTime from "@/components/LocalTime";
import ProfileImage from "@/components/ProfileImage";

interface Props {
  familyId: number;
  post: PostInterface;
  userIsAdmin: boolean;
  userIsPostAuthor: boolean;
}

export default async function Post({
  familyId,
  post,
  userIsAdmin,
  userIsPostAuthor,
}: Props) {
  const authorInfo = await getAuthorInfo(post.authorId);

  return (
    <div className="flex flex-col gap-4 bg-slate-100 p-2 shadow-md shadow-slate-500">
      <pre className="whitespace-pre-wrap font-sans">{post.content}</pre>
      <div className="flex flex-wrap items-center gap-2">
        {authorInfo ? (
          <>
            <ProfileImage size={40} userId={authorInfo.id} />
            <div className="flex flex-col font-mono text-sm">
              {authorInfo.id === 1 ? (
                authorInfo.name
              ) : (
                <Link
                  className="font-bold text-violet-800 hover:underline focus:underline"
                  href={`/users/${post.authorId}`}
                  title={`View ${authorInfo.name}'s profile`}
                >
                  {authorInfo.name}
                </Link>
              )}
              <span>
                <LocalTime timestampFromServer={post.createdAt} />
              </span>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
      {userIsAdmin || userIsPostAuthor ? (
        <DeletePost
          familyId={familyId}
          postId={post.id}
          threadId={post.threadId}
        />
      ) : null}
    </div>
  );
}
