import path from "path";
import fs from "fs";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { checkIfSameFamily } from "@/lib/db/users";
import { ReadableOptions } from "stream";

function streamFile(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk)),
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error),
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new Response("Authentication required", {
      status: 401,
    });
  }
  const { userId } = params;
  const sharedFamily = await checkIfSameFamily(+userId);
  if (!sharedFamily) {
    return new Response("Unauthorized", {
      status: 403,
    });
  }
  const imagePath = path.join(
    process.cwd(),
    "src",
    "uploads",
    "profiles",
    `${userId}.webp`,
  );
  if (!fs.existsSync(imagePath)) {
    return new Response("Image not found", { status: 404 });
  }

  try {
    const data: ReadableStream<Uint8Array> = streamFile(imagePath);
    const res = new Response(data, {
      status: 200,
      headers: new Headers({
        "content-type": "image/webp",
      }),
    });
    return res;
  } catch (err) {
    return new Response("Error reading image", { status: 500 });
  }
}
