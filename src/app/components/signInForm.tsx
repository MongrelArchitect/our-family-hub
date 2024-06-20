import { signIn } from "@/auth";

import Image from "next/image";
import googleIcon from "@/app/assets/icons/google-logo.png";

export default function SignInForm() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className="flex flex-col gap-2 bg-white p-2 text-lg"
    >
      <h2 className="text-xl">Sign In</h2>
      <hr className="border-1 border-violet-300" />
      <p>
        Amet repellendus commodi dolor totam molestiae alias Enim quaerat ipsum
      </p>
      <button
        className="flex flex-wrap items-center gap-4 bg-violet-300 p-2 hover:bg-violet-400 focus:bg-violet-400"
        type="submit"
      >
        <Image
          alt=""
          className="rounded-full bg-white p-1"
          height="40"
          src={googleIcon}
          width="40"
        />
        Sign in with Google
      </button>
    </form>
  );
}
