import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { brand } from "@/lib/brand";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "NumSum Labs — MSME Industrial Innovation & Problem Solving Ecosystem",
  description: "NumSum Labs helps MSMEs identify, structure, and solve industrial challenges through engineering collaboration, research, SOPs, innovation challenges, and pilot validation.",
  icons: { icon: brand.favicon, shortcut: brand.favicon, apple: brand.logo },
  openGraph: { title: "NumSum Labs — MSME Industrial Innovation & Problem Solving Ecosystem", description: "MSME-first industrial innovation through engineering collaboration, research, SOPs, challenges, and pilot validation.", images: [brand.ogImage] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className="dark"><body className="bg-navy font-sans antialiased"><AuthProvider><SiteHeader /><Breadcrumbs />{children}<SiteFooter /></AuthProvider></body></html>; }
