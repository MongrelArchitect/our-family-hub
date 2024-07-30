import Image from "next/image";

import loadingIcon from "@/assets/icons/loading.svg";

interface Props {
  size?: number;
}

export default function Loading({ size }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-inherit">
      <Image
        alt=""
        className={`${size ? `h-[${size}] w-[${size}]` : "h-10 w-10"} animate-spin`}
        src={loadingIcon}
      />
      Loading...
    </div>
  );
}
