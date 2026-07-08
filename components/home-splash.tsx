"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";

export function HomeSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("numsum-home-splash-seen") === "true") return;
    sessionStorage.setItem("numsum-home-splash-seen", "true");
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#02050a] text-white animate-splash-out" aria-label="Welcome to NumSum Labs" role="status">
      <button className="absolute right-5 top-5 z-10 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/35 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-200/70" onClick={() => setVisible(false)}>Skip</button>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,.22),transparent_34%),radial-gradient(circle_at_25%_70%,rgba(245,158,11,.16),transparent_28%)]" />
      <div className="relative flex flex-col items-center px-6 text-center animate-splash-in">
        <Image src={brand.logo} alt="NumSum Labs logo" width={76} height={76} className="rounded-3xl bg-white p-3 shadow-[0_30px_90px_rgba(96,165,250,.28)]" priority />
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.36em] text-blue-100/80">Welcome to NumSum Labs</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] md:text-5xl">Industrial problems. Structured solutions.</h1>
      </div>
    </div>
  );
}
