import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Member",
};

export default function InviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
