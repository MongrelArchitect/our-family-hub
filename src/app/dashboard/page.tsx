import { signOut } from "@/auth";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <h1>Welcome!</h1>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="bg-violet-300 p-1" type="submit">Sign out</button>
      </form>
    </div>
  );
}
