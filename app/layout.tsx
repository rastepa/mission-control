import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Control",
  description: "NanoClaw Operations Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0d0d0d] text-gray-100 min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 ml-56 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
