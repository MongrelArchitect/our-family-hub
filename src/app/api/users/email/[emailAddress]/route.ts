import { NextRequest } from "next/server";

import { getUserIdFromEmail, updateUserLoginTimestamp } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { emailAddress: string } },
) {
  const { emailAddress } = params;
  try {
    const userInDatabase = await getUserIdFromEmail(emailAddress);
    // returns 0 if no such user, or their id if they exist
    if (userInDatabase) {
      return new Response(userInDatabase.toString(), {status: 200});
    } else {
      return new Response(`No user exists with email ${emailAddress}`, {status: 404});
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error(err);
    return new Response(`Error finding user in database: ${err}`, {status: 500});
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
    return new Response(`Error updating user's login timestamp: ${err}`, {status: 500});
  }
}
