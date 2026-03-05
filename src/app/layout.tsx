import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Layout/Header";
import Sidebar from "@/src/components/Layout/Sidebar";
import { AuthProvider } from "@/src/lib/AuthContext";
import { initialAssignments } from "@/src/data/initalData";
import { DataProvider } from "../lib/DataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Мой Бонч",
  description: "Лучшее приложение для учебы!",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const assignmentsCount = initialAssignments.filter(
    (a) => !a.completed,
  ).length;

  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <DataProvider>
            <div className="flex flex-1 overflow-hidden min-h-screen pb-16 sm:pb-0">
              <Sidebar assignmentsCount={assignmentsCount} />
              <main className="flex-1 overflow-auto bg-gray-50">
                {children}
              </main>
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
