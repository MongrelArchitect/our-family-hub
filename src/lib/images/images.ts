"use server";

import sharp from "sharp";

import getUserId from "../auth/user";

export async function resizeProfileImage(name: string, formData: FormData) {
  const userId = await getUserId();
  // XXX TODO XXX
  // some more input validation needed, server-side this time
  const file = formData.get(name) as File;
  // XXX
  const buffer = await file.arrayBuffer();
  await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .webp()
    .toFile(`./public/images/profiles/${userId}.webp`);
}

export async function addNewUserProfileImage(userId: number, imageUrl: string) {
  const image = await fetch(imageUrl);
  const buffer = await image.arrayBuffer();
  await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .webp()
    .toFile(`./public/images/profiles/${userId}.webp`);
}
