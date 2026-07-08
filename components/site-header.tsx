"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthNav } from "@/components/auth-nav";
import { brand } from "@/lib/brand";
import { homeLink, phaseOnePublicLinks } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const publicLinks = [homeLink, ...phaseOnePublicLinks] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/80 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3" aria-label="Primary navigation">
        <Link className="group flex shrink-0 items-center gap-3" href="/" aria-label="NumSum Labs home">
          <Image src={brand.logo} alt="NumSum Labs logo" width={44} height={44} className="rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(96,165,250,.22)] transition group-hover:scale-105" priority />
          <span className="leading-none">
            <span className="block font-display text-2xl font-bold tracking-[-.04em]">NumSum Labs</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.24em] text-blue-100/55 sm:block">MSME innovation network</span>
          </span>
        </Link>
        <div className="mx-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 text-sm text-white/68 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] xl:flex">
          {publicLinks.map(([label, href]) => <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300/60" href={href} key={href}>{label}</Link>)}
        </div>
        <div className="ml-auto hidden lg:block"><AuthNav /></div>
        <button className="ml-auto rounded-full border border-white/10 p-2 text-white/75 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen((value) => !value)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </nav>
      {open && <div id="mobile-site-menu" className="border-t border-white/10 bg-[#02050a]/95 px-6 pb-5 lg:hidden"><div className="mx-auto grid max-w-7xl gap-3 pt-4">{publicLinks.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75" href={href} key={href}>{label}</Link>)}<AuthNav /></div></div>}
    </header>
  );
}
