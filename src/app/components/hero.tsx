import Image from "next/image";
import { getImageProps } from "next/image";

import heroWide from "@/app/assets/images/hero.jpg";
import heroSquare from "@/app/assets/images/hero-square.jpg";
import logoIcon from "@/app/assets/icons/logo-white.png";

export default function Hero() {
  const common = {
    alt: "Watercolor painting of a two-story house with people in front, lavender plants in the foreground.",
    sizes: "100vw",
  };
  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({
    ...common,
    src: heroWide,
  });
  const {
    props: { srcSet: mobile },
  } = getImageProps({
    ...common,
    src: heroSquare,
  });

  return (
    <div>
      <div className="flex w-full items-center gap-2 bg-violet-300 p-1">
        <Image alt="" className="max-h-[48px] max-w-[48px]" src={logoIcon} />
        <h1 className="text-3xl">Our Family Hub</h1>
      </div>
      <picture>
        <source media="(max-width: 599px)" srcSet={mobile} />
        <source media="(min-width: 600px)" srcSet={desktop} />
        <img {...rest} style={{ width: "100%", height: "auto" }} />
      </picture>
    </div>
  );
}
