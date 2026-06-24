import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { brand } from "@/lib/brand";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "NumSum Lab — Building Possibilities",
  description: "NumSum connects industrial challenges with MSMEs, researchers, startups, students, and organizations.",
  icons: { icon: brand.favicon, shortcut: brand.favicon, apple: brand.logo },
  openGraph: { title: "NumSum Lab", description: "Building Possibilities through industrial innovation collaboration.", images: [brand.ogImage] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className="dark"><body className="bg-navy font-sans antialiased"><AuthProvider><SiteHeader />{children}<SiteFooter /></AuthProvider></body></html>; }
