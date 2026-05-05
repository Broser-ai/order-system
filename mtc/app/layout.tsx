import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Master Team Console",
  description: "Universal AI orchestration platform — 90 departments, 58 ecosystems, 8 execution patterns",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased bg-black text-white">
      <body className="h-full">{children}</body>
    </html>
  );
}
