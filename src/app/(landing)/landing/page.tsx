import Hero from "./Hero";
import SignInForm from "./SignInForm";

export default async function Landing() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <div className="flex flex-col justify-between gap-2 my-2 bg-neutral-100 p-2 shadow-md shadow-slate-500">
        <p>
          Our Family Hub provides private spaces for nurturing family
          connections. Create hubs, invite members, and enjoy a centralized
          place for communication and collaboration. From sharing stories to
          planning activities, simplify how your family interacts and stays
          connected.
        </p>
        <SignInForm />
      </div>
    </div>
  );
}
