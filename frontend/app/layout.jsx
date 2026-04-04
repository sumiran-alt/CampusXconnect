"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import Navigation from "@/components/Navigation";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({ children }) {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CampusXConnect - Professional student networking platform" />
        <title>CampusXConnect - Student Networking Platform</title>
      </head>
      <body className="bg-white text-gray-900">
        <Navigation />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
