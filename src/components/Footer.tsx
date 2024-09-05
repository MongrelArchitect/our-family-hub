import Link from "next/link";
import { auth } from "@/auth";

export default async function Footer() {
  let aboutUrl = "/landing/about";
  let tosUrl = "/landing/tos";
  const session = await auth();

  if (session) {
    aboutUrl = "/about";
    tosUrl = "/tos";
  }

  return (
    <footer className="mt-auto flex items-center gap-8 border-t-2 border-violet-400 bg-violet-200 p-1 text-xs">
      <Link
        className="font-bold hover:underline focus:underline"
        href={aboutUrl}
      >
        About
      </Link>
      <Link className="font-bold hover:underline focus:underline" href={tosUrl}>
        Terms &amp; Conditions
      </Link>
    </footer>
  );
}
