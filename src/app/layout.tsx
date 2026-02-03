import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/AppShell";

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
        <AuthProvider>
          <ProtectedRoute>
            <DataProvider>
              <AppShell>{children}</AppShell>
            </DataProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
