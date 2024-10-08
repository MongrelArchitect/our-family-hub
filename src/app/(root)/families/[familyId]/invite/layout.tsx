import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invite New Member",
};

export default function InviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
