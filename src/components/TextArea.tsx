"use client";
import { forwardRef, useState } from "react";
import Image from "next/image";
import alertIcon from "@/assets/icons/alert.svg";

interface Props {
  attempted: boolean;
  errorText: string;
  id: string;
  labelText: string;
  maxLength: number;
  required?: boolean;
  rows?: number;
  tabIndex?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      attempted,
      errorText,
      id,
      labelText,
      maxLength,
      required,
      rows,
      tabIndex,
    }: Props,
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [valid, setValid] = useState(false);
    const [value, setValue] = useState("");

    const handleChange = (event: React.SyntheticEvent) => {
      const target = event.target as HTMLTextAreaElement;
      setValue(target.value);
      setValid(target.validity.valid);
    };

    const handleFocus = (event: React.SyntheticEvent) => {
      const target = event.target as HTMLTextAreaElement;
      const { id } = target;
      setFocused(document.activeElement?.id === id);
    };

    return (
      <div className="relative flex flex-col">
        <label
          className={`${focused || value ? "-translate-y-2.5 translate-x-0.5 text-sm text-neutral-400" : null} pointer-events-none absolute left-2 top-3 select-none bg-white text-neutral-600 transition-all`}
          htmlFor="surname"
        >
          {labelText}
        </label>
        {attempted && !valid ? (
          <Image
            alt=""
            className="alert-red absolute right-2 top-3.5"
            src={alertIcon}
          />
        ) : null}
        <textarea
          className={`${attempted && !valid ? "border-red-700 text-red-700 hover:outline-red-700 focus:outline-red-700" : "hover:outline-slate-600 focus:outline-slate-600"} border-2 border-neutral-600 p-2 pt-4 hover:outline focus:outline`}
          id={id}
          maxLength={maxLength}
          name={id}
          onBlur={handleFocus}
          onChange={handleChange}
          onFocus={handleFocus}
          ref={ref}
          required={required}
          rows={rows || 4}
          tabIndex={tabIndex || 0}
          value={value || ""}
        />
        {attempted && !valid ? (
          <div className="absolute right-10 top-4 text-sm text-red-700">
            {errorText || "Required"}
          </div>
        ) : null}
      </div>
    );
  },
);

export default TextArea;
