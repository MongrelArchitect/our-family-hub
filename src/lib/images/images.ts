"use server";

import sharp from "sharp";
import {fileTypeFromBlob} from 'file-type';

import getUserId from "../auth/user";

export async function updateProfileImage(name: string, formData: FormData) {
  const userId = await getUserId();
  const file = formData.get(name) as File;
  const fileInfo = await fileTypeFromBlob(file);
  if (!fileInfo || !fileInfo.mime.includes("image")) {
    throw new Error("File is not an image");
  }
  if (file.size > 0) {
    throw new Error("Image is too large (20MB max)");
  }
  const buffer = await file.arrayBuffer();
  await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .webp()
    .toFile(`./src/uploads/profiles/${userId}.webp`);
}

export async function addNewProfileImage(userId: number, imageUrl: string) {
  const image = await fetch(imageUrl);
  const buffer = await image.arrayBuffer();
  await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .webp()
    .toFile(`./src/uploads/profiles/${userId}.webp`);
}
