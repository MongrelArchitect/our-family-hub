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
    <img
      alt="User profile image"
      className={className || ""}
      // XXX TODO XXX
      // need placeholder image
      referrerPolicy="no-referrer"
      src={user.image || ""}
      width={`${width || 32}`}
      height={`${width || 32}`}
    />
  );
}
