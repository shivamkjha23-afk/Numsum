import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
export const metadata: Metadata = { title: "NumSum — Solving Problems That Matter", description: "NumSum connects real-world industrial challenges with talent, innovation, and solutions." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className="dark"><body className={`${inter.variable} ${space.variable} bg-navy font-sans antialiased`}><SiteHeader />{children}</body></html>; }
