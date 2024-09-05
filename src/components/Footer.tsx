import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto flex items-center border-t-2 border-violet-400 gap-8 bg-violet-200 p-1 text-xs">
      <Link className="font-bold hover:underline focus:underline" href="/about">
        About
      </Link>
      <Link className="font-bold hover:underline focus:underline" href="/tos">
        Terms &amp; Conditions
      </Link>
    </footer>
  );
}
