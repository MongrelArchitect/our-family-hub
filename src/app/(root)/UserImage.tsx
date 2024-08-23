"use client";
import { useContext, useEffect, useState } from "react";
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
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`/api/users/${userId}/profile?t=${Date.now()}`);
  }, [profile.updated]);

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
