"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

import "./globals.css";
import Header from "~/component/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/opr4dln.css" />
      </head>
      <body className={inter.className}>
        {pathname !== "/" && <Header />}
        {children}
      </body>
    </html>
  );
}
