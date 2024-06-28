import Hero from "./components/hero";
import SignInForm from "./components/signInForm";

export default async function Home() {
  return (
    <div className="flex flex-col items-center">
      <main className="flex w-full max-w-[1000px] flex-col gap-2 bg-white shadow-sm shadow-slate-700">
        <Hero />
        <SignInForm />
      </main>
    </div>
  );
}
