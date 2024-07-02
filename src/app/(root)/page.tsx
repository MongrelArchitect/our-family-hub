import UserName from "@/app/components/username";

export default async function Home() {
  return (
    <main className="flex flex-col gap-2 p-2">
      <h2 className="text-2xl">
        Welcome <UserName />!
      </h2>
    </main>
  );
}
