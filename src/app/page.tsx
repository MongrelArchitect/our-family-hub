import Hero from "@/components/hero";
import SignInForm from "./components/signInForm";

export default async function Home() {
  return (
    <main className="flex flex-col gap-2">
      <Hero />
      <SignInForm />
    </main>
  );
}
