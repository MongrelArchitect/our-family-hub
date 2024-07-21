import { auth } from "@/auth";

export default async function getUserId() {
  const session = await auth();
  if (!session) {
    throw new Error("No session");
  }
  const { user } = session;
  if (!user || !user.id) {
    throw new Error("No user or missing id");
  }
  return +user.id;
}
