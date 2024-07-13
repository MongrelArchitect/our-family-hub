import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
