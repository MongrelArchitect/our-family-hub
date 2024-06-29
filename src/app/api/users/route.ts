import { NextRequest } from "next/server";

import { addUserToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userInfo = (await req.json()) as {
      name: string;
      email: string;
      image: string;
    };
    const result = await addUserToDatabase(userInfo);
    // result will be the id of the newly created user
    if (result) {
      // XXX TODO XXX
      // log this
      return new Response(result.toString(), { status: 201 });
    } else {
      // XXX TODO XXX
      // log this
      return new Response(`Error adding new user to database: ${result}`, {
        status: 500,
      });
    }
  } catch (err) {
    // XXX TODO XXX
    // log this
    console.error(err);
    return new Response(`Error adding new user to database: ${err}`, {
      status: 500,
    });
  }
}
