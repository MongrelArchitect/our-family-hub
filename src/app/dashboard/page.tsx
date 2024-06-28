import { signOut } from "@/auth";

import UserImage from "./components/userimage";
import UserName from "./components/username";

export default function Dashboard() {
  return (
    <main className="flex flex-col gap-2">
        Welcome <UserName />!
      <UserImage />
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="bg-violet-300 p-1" type="submit">
          Sign out
        </button>
      </form>
    </main>
  );
}
