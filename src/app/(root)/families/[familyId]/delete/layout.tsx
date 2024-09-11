import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Family",
};

export default function InviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
