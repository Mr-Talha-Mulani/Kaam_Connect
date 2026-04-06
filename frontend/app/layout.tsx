import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "KaamConnect – Find Work. Hire Workers. Instantly.",
  description:
    "KaamConnect connects skilled blue-collar workers with employers across India. Find jobs or hire reliable workers in just a few taps.",
  keywords: "jobs, blue collar, workers, India, hiring, kaamconnect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7FAFF] flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
