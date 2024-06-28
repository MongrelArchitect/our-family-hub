import UserName from "./components/username";

export default function Dashboard() {
  return (
    <main className="flex flex-col gap-2 p-2">
      <h2 className="text-2xl">
        Welcome <UserName />!
      </h2>
    </main>
  );
}
