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
    if (result.rowCount) {
      // XXX TODO XXX
      // log this
      return new Response("User added to database", { status: 201 });
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
