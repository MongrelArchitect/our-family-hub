import { NextRequest } from "next/server";

import { checkIfUserInDatabase, updateUserLoginTimestamp } from "@/lib/db";

export async function HEAD(
  req: NextRequest,
  { params }: { params: { emailAddress: string } },
) {
  const { emailAddress } = params;
  try {
    const userInDatabase = await checkIfUserInDatabase(emailAddress);
    if (userInDatabase) {
      return new Response(null, {status: 204});
    } else {
      return new Response(null, {status: 404});
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error(err);
    return new Response(null, {status: 500});
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { emailAddress: string } },
) {
  try {
    const { emailAddress } = params;
    const result = await updateUserLoginTimestamp(emailAddress);
    if (result.rowCount) {
      return new Response("User's login timestamp updated", { status: 200 });
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error(err);
    return new Response("Error updating user's login timestamp", {status: 500});
  }
}
