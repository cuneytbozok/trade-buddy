import React from "react";
import { HeaderMenu } from "@/components/headermenu";
import { AuthProvider } from "@/contexts/auth-context"; // Import the AuthProvider
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Trade Buddy",
  description: "Your trading companion app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <AuthProvider>
          <HeaderMenu />
          <Toaster />
          <main className="pt-[80px]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}