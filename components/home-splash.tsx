"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";

export function HomeSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#02050a] text-white animate-splash-out">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,.22),transparent_34%),radial-gradient(circle_at_25%_70%,rgba(245,158,11,.16),transparent_28%)]" />
      <div className="relative flex flex-col items-center text-center animate-splash-in">
        <Image src={brand.logo} alt="NumSum Labs logo" width={82} height={82} className="rounded-3xl bg-white p-3 shadow-[0_30px_90px_rgba(96,165,250,.28)]" priority />
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.55em] text-blue-100/80">Welcome to</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.04em] md:text-6xl">NumSum Labs</h1>
        <p className="mt-4 max-w-md text-sm text-white/58">Industrial problems, structured into measurable innovation.</p>
      </div>
    </div>
  );
}
