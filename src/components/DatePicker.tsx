import { forwardRef, useEffect, useState } from "react";

import Image from "next/image";

import alertIcon from "@/assets/icons/alert.svg";

interface Props {
  attempted: boolean;
  id: string;
  labelText: string;
  required?: boolean;
  tabIndex?: number;
}

const DatePicker = forwardRef<HTMLInputElement, Props>(
  ({ attempted, id, labelText, required, tabIndex }: Props, ref) => {
    const [valid, setValid] = useState(true);

    const checkValidDate = (event: React.SyntheticEvent) => {
      const target = event.target as HTMLInputElement;
      setValid(target.validity.valid);
    };

    useEffect(() => {
      // XXX
      // janky...
      const input = document.getElementById(id) as HTMLInputElement;
      setValid(input.validity.valid);
    }, [attempted]);

    return (
      <div className="relative flex flex-col gap-1">
        <label htmlFor={id}>{labelText}</label>
        {attempted && !valid ? (
          <Image
            alt=""
            className="alert-red absolute right-9 top-12"
            src={alertIcon}
          />
        ) : null}
        {attempted && !valid ? (
          <div className="absolute right-16 top-12 text-sm text-red-700">
            Invalid date
          </div>
        ) : null}
        <input
          className={`${attempted && !valid ? "border-red-700 text-red-700 hover:outline hover:outline-red-700 focus:outline-red-700" : "hover:outline-slate-600 focus:outline-slate-600"} border-2 border-neutral-600 p-2 font-mono hover:outline focus:outline`}
          id={id}
          name={id}
          onChange={checkValidDate}
          onBlur={checkValidDate}
          ref={ref}
          required={required}
          tabIndex={tabIndex || 0}
          type="date"
        />
      </div>
    );
  },
);

export default DatePicker;
