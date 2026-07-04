"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AuthNav } from "@/components/auth-nav";
import { useIsAdmin } from "@/components/auth-provider";
import { brand } from "@/lib/brand";
import { navGroups, primaryNavLinks } from "@/lib/navigation";

function SearchBox({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/problem-statements" className={`relative ${compact ? "w-full" : "w-56 xl:w-72"}`} role="search">
      <label htmlFor={compact ? "mobile-site-search" : "site-search"} className="sr-only">Search NumSum public resources</label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
      <input id={compact ? "mobile-site-search" : "site-search"} name="q" placeholder="Search challenges…" className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-amber-200/70" />
    </form>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const visibleGroups = navGroups.filter((group) => !group.adminOnly || isAdmin);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link className="flex items-center gap-3" href="/" aria-label="NumSum Labs home">
          <Image src={brand.logo} alt="NumSum Labs logo" width={40} height={40} className="rounded-xl bg-white p-1" priority />
          <span className="font-display text-2xl font-bold">NumSum Labs</span>
        </Link>
        <div className="hidden flex-1 items-center justify-center gap-1 text-sm text-white/70 lg:flex">
          {primaryNavLinks.map(([label, href]) => <Link className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white" href={href} key={href}>{label}</Link>)}
          {visibleGroups.map((group) => (
            <div className="group relative" key={group.label}>
              <button className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/60" aria-haspopup="true">{group.label}</button>
              <div className={`invisible absolute left-1/2 top-full ${group.sections ? "w-[min(920px,calc(100vw-3rem))]" : "w-64"} -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100`}>
                <div className={group.sections ? "grid gap-4 rounded-xl border border-white/10 bg-[#07101d] p-4 shadow-2xl md:grid-cols-4" : "grid gap-1 rounded-xl border border-white/10 bg-[#07101d] p-2 shadow-2xl"}>
                  {group.sections ? group.sections.map((section) => <div key={section.label}><p className="px-3 pb-2 text-xs uppercase tracking-[.22em] text-amber-200">{section.label}</p>{section.links.map(([label, href]) => <Link className="block rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white" href={href} key={href}>{label}</Link>)}</div>) : group.links?.map(([label, href]) => <Link className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white" href={href} key={href}>{label}</Link>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex"><SearchBox /><AuthNav /></div>
        <button className="rounded-full border border-white/10 p-2 text-white/75 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </nav>
      {open && <div className="border-t border-white/10 px-6 pb-5 lg:hidden"><div className="mx-auto grid max-w-7xl gap-4 pt-4"><SearchBox compact />{primaryNavLinks.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75" href={href} key={href}>{label}</Link>)}{visibleGroups.map((group) => <div key={group.label}><p className="text-xs uppercase tracking-[.25em] text-amber-200">{group.label}</p><div className="mt-2 grid gap-3">{group.sections ? group.sections.map((section) => <div key={section.label}><p className="text-xs text-amber-100">{section.label}</p><div className="mt-1 grid gap-2">{section.links.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75" href={href} key={href}>{label}</Link>)}</div></div>) : group.links?.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75" href={href} key={href}>{label}</Link>)}</div></div>)}<AuthNav /></div></div>}
    </header>
  );
}
