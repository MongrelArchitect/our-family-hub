import Image from "next/image";

import cancelIcon from "@/assets/icons/close-circle.svg";
import saveIcon from "@/assets/icons/save.svg";

interface Props {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaHidden?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  style: "submit" | "cancel";
  tabIndex?: number;
  type: "button" | "submit";
}

export default function Button({
  ariaControls,
  ariaExpanded,
  ariaHidden,
  children,
  onClick,
  style,
  tabIndex,
  type,
}: Props) {
  const getColors = () => {
    if (style === "submit") {
      return "bg-indigo-300 hover:bg-indigo-400 focus:bg-indigo-400";
    }
    return "bg-rose-300 hover:bg-rose-400 focus:bg-rose-400";
  };

  return (
    <button
      aria-controls={ariaControls || undefined}
      aria-expanded={ariaExpanded || undefined}
      aria-hidden={ariaHidden || false}
      className={`${getColors()} p-2 font-mono`}
      onClick={onClick}
      tabIndex={tabIndex || 0}
      type={type}
    >
      <div className="relative flex flex-wrap items-center gap-2">
        <Image
          alt=""
          src={style === "submit" ? saveIcon : cancelIcon}
          width={32}
        />
        <div className="absolute left-1/2 -translate-x-1/2">{children}</div>
      </div>
    </button>
  );
}
