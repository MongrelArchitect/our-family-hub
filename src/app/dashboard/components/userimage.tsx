import Image from "next/image";

import { auth } from "@/auth";

export default async function UserImage() {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const { user } = session;

  return (
    <Image 
      alt="User profile image"
      src={user.image || ""}
      width="32"
      height="32"
    />
  );
}
