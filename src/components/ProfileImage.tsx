"use client";
import { useEffect, useState } from "react";
import Loading from "./Loading";

interface Props {
  extraClasses?: string;
  reloadTrigger?: boolean;
  size: number;
  userId: number;
}

export default function ProfileImage({
  extraClasses,
  reloadTrigger,
  size,
  userId,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setLoaded(false);
    setUrl(`/api/users/${userId}/profile?t=${Date.now()}`);
  }, [reloadTrigger]);

  return (
    <div className="relative">
      <div
        className={`${loaded ? "hidden" : null} absolute left-0 top-0 flex w-full items-center justify-center bg-white max-w-[${size}] h-full max-h-[${size}] rounded-full border-2 border-slate-600`}
      >
        <Loading circleOnly size={5} />
      </div>
      <img
        alt=""
        className={`${extraClasses} rounded-full border-2 border-slate-600`}
        onLoad={() => {
          setLoaded(true);
        }}
        src={url}
        width={size}
        height={size}
      />
    </div>
  );
}
