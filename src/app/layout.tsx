import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import Sidebar from "@/components/Sidebar";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umbra HQ - Collaboration Dashboard",
  description: "Central hub for Joe and Umbra collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.className} bg-zinc-50 dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-100 antialiased`}>
        <DataProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-72 p-10">
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
