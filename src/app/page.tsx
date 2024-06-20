import Hero from "./components/hero";
import SignInForm from "./components/signInForm";

export default async function Home() {
  return (
    <main className="flex w-full max-w-[1000px] flex-col gap-2 shadow-sm shadow-slate-700 bg-white">
      <Hero />
      <SignInForm />
    </main>
  );
}
