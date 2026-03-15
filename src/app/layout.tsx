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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192x192.png" }],
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased   h-screen flex flex-col`}
      >
        <AuthProvider>
          <Header />
          <DataProvider>
            <div className="flex flex-1 sm:pb-0 ">
              <Sidebar assignmentsCount={assignmentsCount} />
              <main className="flex-1 bg-gray-50 overflow-auto">
                {children}
              </main>
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
