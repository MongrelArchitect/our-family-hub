import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfer Admin Role",
};

export default function InviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
