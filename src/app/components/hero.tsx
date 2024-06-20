import Image from "next/image";

import heroImage from "@/app/assets/images/hero.jpg";
import logoIcon from "@/app/assets/icons/logo-white.png";

export default function Hero() {
  return (
    <div>
      <div className="flex w-full items-center gap-2 bg-violet-300 p-1">
        <Image alt="" className="max-h-[48px] max-w-[48px]" src={logoIcon} />
        <h1 className="text-3xl">Our Family Hub</h1>
      </div>
      <Image alt="" src={heroImage} />
    </div>
  );
}
