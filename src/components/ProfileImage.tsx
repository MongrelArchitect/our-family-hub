"use client";
import { useEffect, useState } from "react";

interface Props {
  extraClasses?: string;
  reloadTrigger?: boolean;
  size: number;
  userId: number;
}

export default function ProfileImage({ extraClasses, reloadTrigger, size, userId }: Props) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`/images/profiles/${userId}.webp?t=${Date.now()}`);
  }, [reloadTrigger]);

  return (
    <img
      alt=""
      className={`${extraClasses} rounded-full border-2 border-slate-600`}
      src={url}
      width={size}
      height={size}
    />
  );
}
