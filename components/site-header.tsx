"use client";
import Link from "next/link";
import { useState } from "react";
import { AuthNav } from "@/components/auth-nav";
import { useIsAdmin } from "@/components/auth-provider";
import { navGroups } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const visibleGroups = navGroups.filter((group) => !group.adminOnly || isAdmin);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
        <Link className="font-display text-2xl font-bold" href="/">
          NumSum
        </Link>
        <div className="hidden flex-1 justify-center gap-3 text-sm text-white/70 lg:flex">
          {visibleGroups.map((group) => (
            <div className="group relative" key={group.label}>
              <button className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
                {group.label} <span aria-hidden="true">▼</span>
              </button>
              <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="grid gap-1 rounded-2xl border border-white/10 bg-[#07101d] p-2 shadow-2xl">
                  {group.links.map(([label, href]) => (
                    <Link
                      className="rounded-xl px-3 py-2 transition hover:bg-white/10 hover:text-white"
                      href={href}
                      key={href}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ml-auto hidden lg:block">
          <AuthNav />
        </div>
        <button
          className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 px-6 pb-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-4 pt-4">
            {visibleGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs uppercase tracking-[.25em] text-blue-300">
                  {group.label}
                </p>
                <div className="mt-2 grid gap-2">
                  {group.links.map(([label, href]) => (
                    <Link
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75"
                      href={href}
                      key={href}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <AuthNav />
          </div>
        </div>
      )}
    </header>
  );
}
