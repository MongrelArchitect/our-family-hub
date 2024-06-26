import { auth } from "@/auth";

export default async function UserName() {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const { user } = session;

  return (
    user.name
  );
}
