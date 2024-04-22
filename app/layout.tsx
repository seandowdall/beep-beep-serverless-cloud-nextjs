import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers";
import LandingNavbar from "../components/landing-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beep Beep",
  description:
    "Turn your car into a business or rent your dream vehicle with Beep Beep's peer-to-peer carsharing platform!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LandingNavbar /> {children}
        </Providers>
      </body>
    </html>
  );
}
