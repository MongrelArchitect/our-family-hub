import { getImageProps } from "next/image";

import heroWide from "@/assets/images/hero.jpg";
import heroSquare from "@/assets/images/hero-square.jpg";

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
      <picture>
        <source media="(max-width: 465px)" srcSet={mobile} />
        <source media="(min-width: 466px)" srcSet={desktop} />
        <img
          {...rest}
          style={{ width: "100%", height: "auto" }}
        />
      </picture>
    </div>
  );
}
