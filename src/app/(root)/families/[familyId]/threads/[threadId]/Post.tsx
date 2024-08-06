import { PostInterface } from "@/types/Threads";
import { getOtherUsersInfo as getAuthorInfo } from "@/lib/db/users";

import LocalTime from "@/components/LocalTime";

interface Props {
  post: PostInterface;
}

export default async function Post({ post }: Props) {
  const authorInfo = await getAuthorInfo(post.authorId);

  return (
    <div className="flex flex-col gap-4 bg-slate-100 p-2 shadow-md shadow-slate-500">
      <pre className="whitespace-pre-wrap font-sans">{post.content}</pre>
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
            <LocalTime timestampFromServer={post.createdAt} />
          </span>
        </div>
      </div>
    </div>
  );
}
