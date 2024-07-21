import Image from "next/image";

import loadingIcon from "@/assets/icons/loading.svg";

export default function Loading() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-inherit">
      <Image alt="" className="h-10 w-10 animate-spin" src={loadingIcon} />
      Loading...
    </div>
  );
}
