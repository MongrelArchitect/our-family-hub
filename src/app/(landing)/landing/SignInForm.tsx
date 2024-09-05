"use client";
import Link from "next/link";
import { useState } from "react";

import { logIn } from "@/lib/auth/user";

import Button from "@/components/Button";

export default function SignInForm() {
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setAccepted(target.checked);
    setMessage(null);
  };

  const handleClick = () => {
    setMessage("You must accept the terms and conditions to use Our Family Hub.");
  };

  return (
    <form action={logIn} className="flex flex-col gap-2">
      <Button
        disabled={!accepted}
        onClick={accepted ? undefined : handleClick}
        style="google"
        type={accepted ? "submit" : "button"}
      >
        LOG IN
      </Button>
      <div className="flex items-center gap-2">
        <input
          className="size-6 accent-violet-500"
          id="accept-tos"
          name="accept-tos"
          onChange={handleChange}
          type="checkbox"
        />
        <label htmlFor="accept-tos">
          I agree to the{" "}
          <Link
            className="font-bold text-violet-800 hover:underline focus:underline"
            href="/landing/tos"
          >
            terms and conditions
          </Link>
          .
        </label>
      </div>
        {message ? <div className="text-red-700 text-sm font-bold">{message}</div> : null}
    </form>
  );
}
