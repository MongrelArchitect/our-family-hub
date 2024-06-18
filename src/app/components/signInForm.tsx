import Link from "next/link";

export default function SignInForm() {
  return (
    <form className="flex flex-col gap-2 bg-white p-2 text-lg shadow-sm shadow-slate-700">
      <h2 className="text-xl">Sign In</h2>
      <hr className="border-1 border-violet-300" />
      <div className="flex flex-col">
        <label htmlFor="email">email</label>
        <input
          className="rounded border-2 border-slate-800 p-1"
          id="email"
          name="email"
          type="text"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">password</label>
        <input
          className="rounded border-2 border-slate-800 p-1"
          id="password"
          name="password"
          type="password"
        />
      </div>
      <button
        className="rounded bg-violet-300 p-2 hover:bg-violet-400 focus:bg-violet-400"
        type="submit"
      >
        Submit
      </button>
      <div className="flex flex-wrap gap-1">
        <span>Need an account?</span>
        <Link
          className="font-bold text-violet-700 hover:underline"
          href="/signup"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
