import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quanta - AI File Search",
  description: "Search for files with a futuristic AI interface",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Quanta - AI File Search</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          {`
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background-color: #0f0f0f;
              color: #0ff;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
