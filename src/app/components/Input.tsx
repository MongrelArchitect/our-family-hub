"use client";

import Image from "next/image";
import { useState } from "react";

import alertIcon from "@/assets/icons/alert.svg";

interface Props {
  attempted: boolean;
  errorText?: string;
  id: string;
  labelText: string;
  maxLength: number;
  required?: boolean;
  type: "email" | "text";
}

export default function Input({
  attempted,
  errorText,
  id,
  labelText,
  maxLength,
  required,
  type,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [valid, setValid] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
    setValid(target.validity.valid);
  };

  const handleFocus = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const { id } = target;
    setFocused(document.activeElement?.id === id);
  };

  return (
    <div className="relative flex flex-col p-2">
      <label
        className={`${focused || value ? "-translate-x-1.5 -translate-y-3.5 scale-75 text-neutral-400" : null} absolute left-4 top-5 text-neutral-600 transition-all`}
        htmlFor="surname"
      >
        {labelText}
      </label>
      {attempted && !valid ? (
        <Image
          alt=""
          className="alert-red absolute right-4 top-5"
          src={alertIcon}
        />
      ) : null}
      <input
        className={`${attempted && !valid ? "border-red-700" : "hover:border-black focus:border-black"} border-2 border-neutral-600 p-2 pt-4 outline-none`}
        id={id}
        maxLength={maxLength}
        name={id}
        onBlur={handleFocus}
        onChange={handleChange}
        onFocus={handleFocus}
        required={required}
        type={type}
        value={value || ""}
      />
      {attempted && !valid ? (
        <div className="absolute right-11 top-6 text-sm text-red-700">
          {errorText || "Required"}
        </div>
      ) : null}
    </div>
  );
}
