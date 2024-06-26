import { signOut } from "@/auth";

import UserImage from "./components/userimage";
import UserName from "./components/username";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <h1>
        Welcome <UserName />!
      </h1>
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
    </div>
  );
}
