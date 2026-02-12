import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Educational Kids Website",
  description: "A fun learning place for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
  <div className="min-h-screen bg-gradient-to-b from-sky-50 via-pink-50 to-yellow-50">
    {/* Floating fun blobs */}
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute top-32 -right-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-yellow-200/40 blur-3xl" />
    </div>

    <div className="relative">{children}</div>
  </div>
</body>

    </html>
  );
}
