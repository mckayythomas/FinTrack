import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTrack - Finances",
  description: "Finance Tracking made easy!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex min-h-screen flex-col justify-between ${inter.className}`}
      >
        <Header />
        <main className="mx-[5%] my-10 flex-grow md:mx-[13%]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
