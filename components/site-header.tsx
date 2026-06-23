import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";

const links = [
  ["Home", "/"],
  ["Challenges", "/challenges"],
  ["MSME Intelligence", "/msme-intelligence"],
  ["Research", "/research"],
  ["Community", "/community"],
  ["Organizations", "/organizations"],
  ["Knowledge", "/knowledge"],
];

export function SiteHeader() {
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02050a]/80 backdrop-blur-xl"><nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4"><Link className="font-display text-2xl font-bold" href="/">NumSum</Link><div className="hidden flex-1 justify-center gap-5 text-sm text-white/70 lg:flex">{links.map(([label, href]) => <Link className="transition hover:text-white" href={href} key={href}>{label}</Link>)}</div><div className="ml-auto"><AuthNav /></div></nav></header>;
}
