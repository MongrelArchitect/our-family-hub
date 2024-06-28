import Sidebar from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-neutral-50 min-h-screen">
      <Sidebar />
      <div className="w-full">
        <h1 className="bg-violet-300">Dashboard</h1>
        {children}
      </div>
    </div>
  );
}
