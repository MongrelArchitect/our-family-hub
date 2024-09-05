import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
