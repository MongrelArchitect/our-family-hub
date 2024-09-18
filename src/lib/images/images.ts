"use server";

import { fileTypeFromBlob } from "file-type";
import fs from "fs";
import path from "path";
import sharp from "sharp";

import getUserId from "../auth/user";

import { checkIfUserIsAdmin } from "../db/families";

const FAMILY_IMAGE_SIZE = 640;

export async function addNewFamilyImage(
  name: string,
  familyId: number,
  formData: FormData,
  surname: string,
) {
  const file = formData.get(name) as File;
  if (!file.size) {
    // no image provided, make a default one with the first alphabet letter
    const firstLetter = (surname.match(/[a-zA-Z]/) || []).pop()?.toUpperCase();

    const svg = `
    <svg width="${FAMILY_IMAGE_SIZE}" height="${FAMILY_IMAGE_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ddd6fe"/>
      <text x="${FAMILY_IMAGE_SIZE / 2}" y="${FAMILY_IMAGE_SIZE / 2 + 96}" font-size="320" font-weight="bold" fill="black" dominant-baseline="middle" text-anchor="middle" font-family="Arial">
        ${firstLetter}
      </text>
    </svg>
  `;
    await sharp(Buffer.from(svg))
      .resize(FAMILY_IMAGE_SIZE, FAMILY_IMAGE_SIZE, { fit: "fill" })
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
      .resize(FAMILY_IMAGE_SIZE, FAMILY_IMAGE_SIZE, { fit: "inside" })
      .webp()
      .toFile(`./src/uploads/families/${familyId}.webp`);
  }
}

export async function updateFamilyImage(
  name: string,
  familyId: number,
  formData: FormData,
) {
  const userIsAdmin = await checkIfUserIsAdmin(familyId);
  if (!userIsAdmin) {
    throw new Error("Only family admin can change image");
  }
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
    .resize(FAMILY_IMAGE_SIZE, FAMILY_IMAGE_SIZE, { fit: "inside" })
    .webp()
    .toFile(`./src/uploads/families/${familyId}.webp`);
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

export async function deleteProfileImage() {
  const userId = await getUserId();

  const imagePath = path.join(
    process.cwd(),
    "src",
    "uploads",
    "profiles",
    `${userId}.webp`,
  );
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      // XXX TODO XXX
      // log this
      if (err) throw err;
    });
  }
}

export async function deleteFamilyImage(familyId: number) {
  const userIsAdmin = await checkIfUserIsAdmin(familyId);

  if (!userIsAdmin) {
    throw new Error("User is not family admin");
  }

  const imagePath = path.join(
    process.cwd(),
    "src",
    "uploads",
    "families",
    `${familyId}.webp`,
  );
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      // XXX TODO XXX
      // log this
      if (err) throw err;
    });
  }
}
