import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Edit Family Info",
};

export default function InviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
