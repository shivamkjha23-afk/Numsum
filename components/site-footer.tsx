import Image from "next/image";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return <footer className="border-t border-white/10 bg-[#02050a] px-6 py-10 text-sm text-white/60"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left"><div className="flex items-center gap-3"><Image src={brand.logo} alt="NumSum Labs logo" width={46} height={46} className="rounded-2xl bg-white p-1" /><div><p className="font-display text-xl font-bold text-white">{brand.labName}</p><p className="text-blue-200">{brand.tagline}</p></div></div><p>© 2026 NumSum Labs. All Rights Reserved.</p></div></footer>;
}
