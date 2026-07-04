"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  "problem-statements": "MSME Challenges",
  competitions: "Competitions",
  knowledge: "Knowledge",
  research: "Research",
  sops: "SOP Library",
  community: "Community",
  pilots: "Impact / Pilots",
  "msme-intelligence": "MSME Intelligence",
  "submit-problem": "Submit MSME Challenge",
  join: "Join",
  about: "About",
  admin: "Admin",
};

function humanize(segment: string) {
  return labels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: humanize(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
    current: index === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="border-b border-white/10 bg-[#02050a] px-6 py-3 text-sm text-white/60">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-amber-100">Home</Link></li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-white/30">/</span>
            {crumb.current ? <span aria-current="page" className="text-amber-100">{crumb.label}</span> : <Link href={crumb.href} className="hover:text-amber-100">{crumb.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
