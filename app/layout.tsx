import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LiffProvider } from "@/components/LiffProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nabeatsu Game",
  description: "A fun counting game based on the Japanese comedian Nabeatsu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID || ""}>
          {children}
        </LiffProvider>
      </body>
    </html>
  );
}
