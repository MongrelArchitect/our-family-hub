import Hero from "@/components/hero";
import SignUpForm from "./components/signupForm";

export default function Signup() {
  return (
    <main className="flex flex-col gap-2">
      <Hero />
      <SignUpForm />
    </main>
  );
}
