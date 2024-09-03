"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";

import noImageIcon from "@/assets/icons/image-off-outline.svg";

interface Props {
  attempted: boolean;
  clearTrigger: boolean;
  forProfile?: boolean;
  id: string;
  removeError?: () => void;
  required?: true;
  tabIndex?: number;
  userId?: number;
}

function decimalRound(num: number) {
  return Math.round(num * 100) / 100;
}

function prettyBytes(bytes: number) {
  if (bytes < 1000) {
    return `${bytes} bytes`;
  }
  if (bytes < 1000000) {
    return `${decimalRound(bytes / 1000)} KB`;
  }
  if (bytes < 1000000000) {
    return `${decimalRound(bytes / 1000000)} MB`;
  }
  if (bytes < 1000000000000) {
    return `${decimalRound(bytes / 1000000000)} GB`;
  }
  if (bytes < 1000000000000000) {
    return `${decimalRound(bytes / 1000000000000)} TB`;
  }
  return "TOO BIG!";
}

export default function ImagePicker({
  attempted,
  clearTrigger,
  forProfile,
  id,
  removeError,
  required,
  tabIndex,
  userId,
}: Props) {
  const filePickerRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [valid, setValid] = useState(!required);

  useEffect(() => {
    const input = filePickerRef.current;
    if (input) {
      input.value = "";
    }
    setFile(null);
    setError(null);
    setValid(!required);
  }, [clearTrigger]);

  const displayImageInfo = () => {
    if (file) {
      return (
        <div
          className={`${attempted && error ? "text-red-700" : null} flex flex-col items-center gap-1`}
        >
          <div className="break-all">{file.name}</div>
          <div>{prettyBytes(file.size)}</div>
        </div>
      );
    }
    return "No file selected";
  };

  const displayImagePreview = () => {
    if (file) {
      return (
        <img alt="" className="max-h-32" src={URL.createObjectURL(file)} />
      );
    }
    return <Image alt="" src={noImageIcon} width={128} />;
  };

  const displayProfilePreview = () => {
    if (file) {
      return (
        <div
          className="aspect-square max-h-[128px] w-full max-w-[128px] rounded-full border-2 border-slate-600 bg-cover bg-center"
          style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
        />
      );
    }
    return (
      // XXX handle this better now that userId is optional
      <ProfileImage
        reloadTrigger={clearTrigger}
        size={128}
        userId={userId || 0}
      />
    );
  };

  const chooseInvalidFileError = (file: File) => {
    if (!file.type.includes("image/")) {
      return "File is not an image";
    }
    if (file.size > 21000000) {
      return "Image is too large (20MB max)";
    }
    return null;
  };

  const checkValidImage = (file: File) => {
    if (!file.type.includes("image/") || file.size > 21000000) {
      return false;
    }
    return true;
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { files } = target;
    if (files) {
      setFile(files[0]);
      setError(chooseInvalidFileError(files[0]));
      setValid(checkValidImage(files[0]));
    }
    removeError ? removeError() : null;
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (event.dataTransfer && files[0]) {
      setFile(files[0]);
      setError(chooseInvalidFileError(files[0]));
      setValid(checkValidImage(files[0]));
    }
    const input = filePickerRef.current;
    if (input) {
      input.files = files;
    }

    removeError ? removeError() : null;
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`${attempted && error ? "border-red-700" : "border-neutral-900"} flex h-64 flex-col items-center justify-center gap-2 border-2`}
      >
        {forProfile ? displayProfilePreview() : displayImagePreview()}
        <div className="font-mono text-sm">{displayImageInfo()}</div>
        {attempted && error ? (
          <div className="text-red-700">{error}</div>
        ) : null}
      </div>
      <div
        className="flex h-32 w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-900 font-mono"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <label
          className="cursor-pointer bg-indigo-300 p-2 hover:bg-indigo-400 focus:bg-indigo-400"
          htmlFor={id}
          tabIndex={tabIndex || 0}
        >
          CHOOSE FILE
        </label>
        or drop file here
        <input
          accept="image/*"
          hidden
          id={id}
          name={id}
          onChange={handleChange}
          ref={filePickerRef}
          required={required}
          type="file"
        />
        <input
          id={`${id}-validity`}
          name={`${id}-validity`}
          type="hidden"
          value={valid ? 1 : 0}
        />
      </div>
    </div>
  );
}
