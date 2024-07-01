import { auth } from "@/auth";
import { NextRequest } from "next/server";

import { createNewFamily } from "@/lib/db/families";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Authenticated required", { status: 401 });
  }
  if (!session.user) {
    return new Response("Only active users can create families", { status: 403 });
  }

  try {
    const { surname } = await req.json();
    const { user } = session;
    if (!user.id) {
      throw new Error("Missing user id");
    }
    const familyId = await createNewFamily(surname, +user.id);
    return new Response(familyId.toString(), { status: 201 });
  } catch (err) {
    // XXX TODO XXX
    // log this
    return new Response(`Error creating new family: ${err}`, { status: 500 });
  }
}
