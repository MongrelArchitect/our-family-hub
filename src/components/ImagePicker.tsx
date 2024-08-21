"use client";
import Image from "next/image";
import { forwardRef, useEffect, useState } from "react";

import noImageIcon from "@/assets/icons/image-off-outline.svg";

interface Props {
  clearTrigger: boolean;
  defaultImage?: {
    url: string;
    text: string;
  };
  forProfile?: boolean;
  id: string;
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

const ImagePicker = forwardRef<HTMLInputElement, Props>(
  ({ clearTrigger, defaultImage, forProfile, id }: Props, ref) => {
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
      setFile(null);
    }, [clearTrigger]);

    const displayImageInfo = () => {
      if (file) {
        return (
          <div className="flex flex-col items-center gap-1">
            <div className="break-all">{file.name}</div>
            <div>{prettyBytes(file.size)}</div>
          </div>
        );
      }
      if (defaultImage) {
        return defaultImage.text;
      }
      return "No file selected";
    };

    const displayImagePreview = () => {
      if (file) {
        return (
          <img alt="" className="max-h-32" src={URL.createObjectURL(file)} />
        );
      }
      if (defaultImage) {
        return <img alt="" className="max-h-32" src={defaultImage.url} />;
      }
      return <Image alt="" src={noImageIcon} width={128} />;
    };

    const displayProfilePreview = () => {
      if (file) {
        return (
          <div
            className="aspect-square max-h-40 w-full max-w-40 rounded-full border-2 border-slate-600 bg-cover bg-center"
            style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
          />
        );
      }
      if (defaultImage) {
        return (
          <img
            alt=""
            className="max-h-32 rounded-full"
            src={defaultImage.url}
          />
        );
      }
      return <Image alt="" src={noImageIcon} width={128} />;
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
        <div className="flex h-64 flex-col items-center justify-center gap-2 border-2 border-neutral-900">
          {forProfile ? displayProfilePreview() : displayImagePreview()}
          <div className="font-mono text-sm">{displayImageInfo()}</div>
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
          <input
            accept="image/*"
            hidden
            id={id}
            name={id}
            onChange={handleChange}
            ref={ref}
            type="file"
          />
        </div>
      </div>
    );
  },
);

export default ImagePicker;
