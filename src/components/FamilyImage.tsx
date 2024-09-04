"use client";
import { useEffect, useState } from "react";

interface Props {
  extraClasses?: string;
  familyId: number;
  reloadTrigger?: boolean;
  size: number;
}

export default function FamilyImage({
  extraClasses,
  familyId,
  reloadTrigger,
  size,
}: Props) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`/api/families/${familyId}/image?t=${Date.now()}`);
  }, [reloadTrigger]);

  return (
    <img
      alt=""
      className={`${extraClasses} border-2 border-slate-600`}
      src={url}
      width={size}
      height={size}
    />
  );
}
