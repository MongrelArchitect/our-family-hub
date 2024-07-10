import Image from "next/image";

import plusIcon from "@/assets/icons/plus.svg";
import starIcon from "@/assets/icons/star.svg";

export default function Controls({ userIsAdmin }: { userIsAdmin: boolean }) {
  return (
    <>
      <button
        className="absolute bottom-2 right-2 mt-auto flex h-20 w-20 items-center justify-center self-end rounded-full bg-slate-100 font-mono text-5xl shadow-md shadow-slate-500 hover:bg-indigo-200 focus:bg-indigo-200"
        title="Show family actions"
      >
        <Image alt="" height="40" src={plusIcon} width="40" />
      </button>
      {userIsAdmin ? (
        <button
          className="absolute bottom-2 max-lg:left-2 lg:left-44 mt-auto flex h-20 w-20 items-center justify-center self-end rounded-full bg-slate-100 font-mono text-5xl shadow-md shadow-slate-500 hover:bg-indigo-200 focus:bg-indigo-200"
          title="Show admin actions"
        >
          <Image alt="" height="40" src={starIcon} width="40" />
        </button>
      ) : null}
    </>
  );
}
