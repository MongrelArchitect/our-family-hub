"use server";

import sharp from "sharp";
import { fileTypeFromBlob } from "file-type";

import getUserId from "../auth/user";

export async function addNewFamilyImage(
  name: string,
  familyId: number,
  formData: FormData,
) {
  const file = formData.get(name) as File;
  const surname = formData.get("surname") as string;
  const SIZE = 640;
  if (!surname) {
    throw new Error("Missing surname");
  }
  if (!file.size) {
    // no image provided, make a default one
    const firstLetter = surname[0].toUpperCase();

    const svg = `
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ddd6fe"/>
      <text x="${SIZE / 2}" y="${SIZE / 2 + 96}" font-size="320" font-weight="bold" fill="black" dominant-baseline="middle" text-anchor="middle" font-family="Arial">
        ${firstLetter}
      </text>
    </svg>
  `;
    await sharp(Buffer.from(svg))
      .resize(SIZE, SIZE, { fit: "fill" })
      .webp()
      .toFile(`./src/uploads/families/${familyId}.webp`);
  } else {
    // user gave an image, use it
    const fileInfo = await fileTypeFromBlob(file);
    if (!fileInfo || !fileInfo.mime.includes("image")) {
      throw new Error("File is not an image");
    }
    if (file.size > 21000000) {
      throw new Error("Image is too large (20MB max)");
    }
    const buffer = await file.arrayBuffer();
    await sharp(buffer)
      .resize(SIZE, SIZE, { fit: "inside" })
      .webp()
      .toFile(`./src/uploads/families/${familyId}.webp`);
  }
}

export async function updateProfileImage(name: string, formData: FormData) {
  const userId = await getUserId();
  const file = formData.get(name) as File;
  const fileInfo = await fileTypeFromBlob(file);
  if (!fileInfo || !fileInfo.mime.includes("image")) {
    throw new Error("File is not an image");
  }
  if (file.size > 21000000) {
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
