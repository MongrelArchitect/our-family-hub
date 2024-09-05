"use client";
import { useEffect, useState } from "react";
import Loading from "./Loading";

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
  const [loaded, setLoaded] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setLoaded(false);
    setUrl(`/api/families/${familyId}/image?t=${Date.now()}`);
  }, [reloadTrigger]);

  return (
    <div className="relative">
      <div
        className={`${loaded ? "hidden" : null} absolute left-0 top-0 flex w-full items-center justify-center bg-white max-w-[${size}] h-full max-h-[${size}] border-2 border-slate-600`}
      >
        <Loading circleOnly />
      </div>
      <img
        alt=""
        className={`${extraClasses} border-2 border-slate-600`}
        height={size}
        onLoad={() => {
          setLoaded(true);
        }}
        src={url}
        width={size}
      />
    </div>
  );
}
