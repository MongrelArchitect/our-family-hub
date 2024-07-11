import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Family Hub | New Family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
