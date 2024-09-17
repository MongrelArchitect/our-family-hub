"use server";

import { auth, signIn } from "@/auth";

export default async function getUserId() {
  // there is no user with id 0
  let userId = 0;

  const session = await auth();

  if (session && session.user && session.user.id) {
    userId = +session.user.id;
  }

  return userId;
}

export async function logIn() {
  await signIn("google");
}
