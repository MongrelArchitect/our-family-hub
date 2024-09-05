"use client";
import { useContext, useEffect, useState } from "react";

import Loading from "@/components/Loading";

import { ProfileContext } from "@/contexts/Profile";

interface Props {
  extraClasses?: string;
  size: number;
  userId: number;
}

export default function CurrentUserImage({
  extraClasses,
  size,
  userId,
}: Props) {
  const profile = useContext(ProfileContext);
  const [loaded, setLoaded] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setLoaded(false);
    setUrl(`/api/users/${userId}/profile?t=${Date.now()}`);
  }, [profile.updated]);

  return (
    <div className="relative">
      <div
        className={`${loaded ? "hidden" : null} absolute left-0 top-0 flex w-full items-center justify-center bg-white max-w-[${size}] h-full max-h-[${size}] border-2 border-slate-600 rounded-full`}
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
