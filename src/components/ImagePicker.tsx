"use client";
import Image from "next/image";
import { useState } from "react";

import noImageIcon from "@/assets/icons/image-off-outline.svg";

interface Props {
  defaultImage?: string;
  id: string;
}

export default function ImagePicker({ defaultImage, id }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const displayImageInfo = () => {
    if (file) {
      return file.name;
    }
    if (defaultImage) {
      return "Current profile image";
    }
    return "No file selected";
  };

  const displayImagePreview = () => {
    if (file) {
      return (
        <img alt="" className="max-h-32 rounded-full" src={URL.createObjectURL(file)} />
      );
    }
    if (defaultImage) {
      return (
        <img alt="" className="max-h-32 rounded-full" src={defaultImage} />
      );
    }
    return <Image alt="" src={noImageIcon} width={128} />
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { files } = target;
    if (files) {
      setFile(files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-64 flex-col gap-2 items-center justify-center border-2 border-neutral-900">
        {displayImagePreview()}
        <div className="text-sm font-mono">
          {displayImageInfo()}
        </div>
      </div>
      <div className="flex h-32 w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-900">
        <label
          className="cursor-pointer bg-indigo-200 p-2 hover:bg-indigo-300 focus:bg-indigo-300"
          htmlFor={id}
          tabIndex={0}
        >
          Choose a file
        </label>
        or drop file here
        <input accept="image/*" hidden id={id} onChange={handleChange} type="file" />
      </div>
    </div>
  );
}
