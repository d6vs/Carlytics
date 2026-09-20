import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Carlytics — AI-Powered Vehicle Valuation",
  description:
    "Get the true resale value of your car with AI-powered machine learning, visual inspection, and intelligent reasoning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#080B12] text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
