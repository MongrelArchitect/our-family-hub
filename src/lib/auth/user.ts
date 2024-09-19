"use server";

import { auth, signIn } from "@/auth";

export default async function getUserId() {
  // there is no user with id 0
  let userId = 0;

  try {
    const session = await auth();

    if (session && session.user && session.user.id) {
      userId = +session.user.id;
    }
  } catch {
    userId = 0;
  }

  return userId;
}

export async function logIn() {
  await signIn("google");
}
