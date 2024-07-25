import { redirect } from "next/navigation";

import { getUserInfo } from "@/lib/auth/user";

import Hero from "./Hero";
import SignInForm from "./SignInForm";

export default async function Landing() {
  const user = await getUserInfo();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center">
      <main className="flex w-full max-w-[1000px] flex-col gap-2 bg-white shadow-sm shadow-slate-700">
        <Hero />
        <article className="text-lg flex flex-col gap-4 p-2">
          <h2 className="text-2xl font-bold">Welcome to Our Family Hub!</h2>
          <p>
            Our Family Hub provides private spaces for nurturing family
            connections. Create hubs, invite members, and enjoy a centralized
            place for communication and collaboration. From sharing stories to
            planning activities, simplify how your family interacts and stays
            connected.
          </p>
        </article>
        <SignInForm />
      </main>
    </div>
  );
}
