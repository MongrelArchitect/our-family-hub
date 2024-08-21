"use server";

import sharp from "sharp";

import getUserId from "../auth/user";

export async function resizeProfileImage(
  name: string,
  formData: FormData,
) {
  const userId = await getUserId();
  // XXX TODO XXX
  // some more input validation needed, server-side this time
  const file = formData.get(name) as File;
  // XXX
  const buffer = await file.arrayBuffer();
  const resizedImage = await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .webp()
    .toFile(`./src/assets/images/profiles/${userId}.webp`);
  // need to update database to point to this new image
  return resizedImage;
}
