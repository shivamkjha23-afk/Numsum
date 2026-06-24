import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = { title: "NumSum — Building Solutions For MSME Growth", description: "NumSum connects real-world industrial challenges with talent, innovation, and solutions." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className="dark"><body className="bg-navy font-sans antialiased"><AuthProvider><SiteHeader />{children}</AuthProvider></body></html>; }
