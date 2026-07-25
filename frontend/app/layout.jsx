"use client";

import "@/styles/globals.css";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import Navigation from "@/components/Navigation";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CampusXConnect - Student Networking Platform</title>
      </head>
      <body>
        <Navigation />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
