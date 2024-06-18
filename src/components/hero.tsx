import Image from "next/image";

import heroImage from "../../public/images/hero.jpg";

export default function Hero() {
  return (
    <div className="relative">
      <div className="absolute top-0 flex w-full items-center gap-2 bg-violet-300 bg-opacity-85 p-1">
        <Image alt="" src="/icons/crowd.svg" width="64" height="64" />
        <h1 className="text-3xl">Our Family Hub</h1>
      </div>
      <Image alt="" src={heroImage} />
    </div>
  );
}
