"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthNav } from "@/components/auth-nav";
import { brand } from "@/lib/brand";
import { phaseOnePublicLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/72 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5" aria-label="Primary navigation">
        <Link className="group flex shrink-0 items-center gap-3" href="/" aria-label="NumSum Labs home">
          <Image src={brand.logo} alt="NumSum Labs logo" width={40} height={40} className="rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(96,165,250,.18)] transition group-hover:scale-105" priority />
          <span className="font-display text-xl font-bold tracking-[-.04em] sm:text-2xl">NumSum Labs</span>
        </Link>
        <div className="mx-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm text-white/68 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] lg:flex">
          {phaseOnePublicLinks.map(([label, href]) => <Link className={cn("rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300/60", pathname === href && "bg-white/10 text-white")} href={href} key={href}>{label}</Link>)}
        </div>
        <div className="ml-auto hidden lg:block"><AuthNav /></div>
        <button className="ml-auto rounded-full border border-white/10 p-3 text-white/75 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen((value) => !value)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </nav>
      {open && <div id="mobile-site-menu" className="border-t border-white/10 bg-[#02050a]/96 px-5 pb-5 lg:hidden"><div className="mx-auto grid max-w-7xl gap-5 pt-4"><section><p className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-white/45">Public links</p><div className="grid gap-2">{phaseOnePublicLinks.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white/80" href={href} key={href}>{label}</Link>)}</div></section><section><p className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-white/45">Account</p><AuthNav mobile /></section></div></div>}
    </header>
  );
}
