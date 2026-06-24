"use client";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { AuthNav } from "@/components/auth-nav";
import { useIsAdmin } from "@/components/auth-provider";
import { brand } from "@/lib/brand";
import { homeLink, navGroups } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const visibleGroups = navGroups.filter((group) => !group.adminOnly || isAdmin);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link className="flex items-center gap-3" href="/" aria-label="NumSum home">
          <Image src={brand.logo} alt="NumSum Lab logo" width={40} height={40} className="rounded-xl bg-white p-1" priority />
          <span className="font-display text-2xl font-bold">NumSum</span>
        </Link>
        <div className="hidden flex-1 items-center justify-center gap-2 text-sm text-white/70 lg:flex">
          <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href={homeLink[1]}>{homeLink[0]}</Link>
          {visibleGroups.map((group) => (
            <div className="group relative" key={group.label}>
              <button className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{group.label} <span aria-hidden="true">▼</span></button>
              <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="grid gap-1 rounded-2xl border border-white/10 bg-[#07101d] p-2 shadow-2xl">
                  {group.links.map(([label, href]) => <Link className="rounded-xl px-3 py-2 transition hover:bg-white/10 hover:text-white" href={href} key={href}>{label}</Link>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form action="/search" className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 xl:flex">
          <Search size={16} /><input name="q" aria-label="Search NumSum" placeholder="Search platform" className="w-full bg-transparent outline-none placeholder:text-white/40" />
        </form>
        <div className="ml-auto hidden lg:block"><AuthNav /></div>
        <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 lg:hidden" onClick={() => setOpen((value) => !value)}>Menu</button>
      </nav>
      {open && <div className="border-t border-white/10 px-6 pb-5 lg:hidden"><div className="mx-auto grid max-w-7xl gap-4 pt-4"><Link onClick={() => setOpen(false)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75" href="/">Home</Link>{visibleGroups.map((group) => <div key={group.label}><p className="text-xs uppercase tracking-[.25em] text-blue-300">{group.label}</p><div className="mt-2 grid gap-2">{group.links.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75" href={href} key={href}>{label}</Link>)}</div></div>)}<AuthNav /></div></div>}
    </header>
  );
}
