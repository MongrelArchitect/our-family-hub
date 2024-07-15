import Image from "next/image";

import { auth } from "@/auth";

export default async function UserImage({
  className,
  width,
}: {
  className?: string;
  width?: number;
}) {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const { user } = session;

  return (
    <Image
      alt="User profile image"
      className={className || ""}
      // XXX TODO XXX
      // need placeholder image
      src={user.image || ""}
      width={`${width || 32}`}
      height={`${width || 32}`}
    />
  );
}
