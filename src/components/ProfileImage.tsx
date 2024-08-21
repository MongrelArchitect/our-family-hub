"use client";
import { useEffect, useState } from "react";

interface Props {
  reloadTrigger: boolean;
  size: number;
  userId: number;
}

export default function ProfileImage({ reloadTrigger, size, userId }: Props) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`/images/profiles/${userId}.webp?t=${Date.now()}`);
  }, [reloadTrigger]);

    return (
      <img
        alt=""
        className={`border-2 border-slate-600 rounded-full`}
        src={url}
        width={size}
        height={size}
      />
    );
}
