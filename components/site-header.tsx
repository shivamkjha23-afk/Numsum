"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthNav } from "@/components/auth-nav";
import { brand } from "@/lib/brand";
import { homeLink, phaseOnePublicLinks } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const publicLinks = [homeLink, ...phaseOnePublicLinks] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3" aria-label="Primary navigation">
        <Link className="flex items-center gap-3" href="/" aria-label="NumSum Labs home">
          <Image src={brand.logo} alt="NumSum Labs logo" width={40} height={40} className="rounded-xl bg-white p-1" priority />
          <span className="font-display text-2xl font-bold">NumSum Labs</span>
        </Link>
        <div className="hidden flex-1 items-center justify-center gap-1 text-sm text-white/70 lg:flex">
          {publicLinks.map(([label, href]) => <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300/60" href={href} key={href}>{label}</Link>)}
        </div>
        <div className="ml-auto hidden lg:block"><AuthNav /></div>
        <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 lg:hidden" aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen((value) => !value)}>Menu</button>
      </nav>
      {open && <div id="mobile-site-menu" className="border-t border-white/10 px-6 pb-5 lg:hidden"><div className="mx-auto grid max-w-7xl gap-3 pt-4">{publicLinks.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75" href={href} key={href}>{label}</Link>)}<AuthNav /></div></div>}
    </header>
  );
}
