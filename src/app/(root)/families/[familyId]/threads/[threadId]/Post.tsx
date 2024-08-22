import Link from "next/link";
import { PostInterface } from "@/types/Threads";
import { getOtherUsersInfo as getAuthorInfo } from "@/lib/db/users";

import LocalTime from "@/components/LocalTime";
import ProfileImage from "@/components/ProfileImage";

interface Props {
  post: PostInterface;
}

export default async function Post({ post }: Props) {
  const authorInfo = await getAuthorInfo(post.authorId);

  return (
    <div className="flex flex-col gap-4 bg-slate-100 p-2 shadow-md shadow-slate-500">
      <pre className="whitespace-pre-wrap font-sans">{post.content}</pre>
      <div className="flex flex-wrap items-center gap-2">
        <ProfileImage size={40} userId={authorInfo.id} />
        <div className="flex flex-col font-mono text-sm">
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href={`/users/${post.authorId}`}
            title={`View ${authorInfo.name}'s profile`}
          >
            {authorInfo.name}
          </Link>
          <span>
            <LocalTime timestampFromServer={post.createdAt} />
          </span>
        </div>
      </div>
    </div>
  );
}
