"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const sidebarGroups = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin" }] },
  {
    label: "MSME Operations",
    items: [
      { label: "MSME Owners", href: "/admin/msme-owners" },
      { label: "Problems", href: "/admin/problems" },
      { label: "Questionnaires", href: "/admin/questionnaires" },
      { label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    label: "Challenges",
    items: [
      { label: "Challenges", href: "/admin/challenges" },
      { label: "Create Challenge", href: "/admin/challenges/new" },
    ],
  },
  {
    label: "Content & Community",
    items: [
      { label: "Case Studies", href: "/admin/case-studies" },
      { label: "Community Moderation", href: "/admin/community" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users", href: "/admin/users", superOnly: true },
      { label: "System Health", href: "/admin/system-health" },
    ],
  },
] as const;

function titleize(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AdminSidebar({ role, mobile = false }: { role?: string; mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className={cn("space-y-7", mobile && "pt-4")}>
      {sidebarGroups.map((group) => {
        const items = group.items.filter((item) => !("superOnly" in item) || role === "super_admin");
        if (!items.length) return null;
        return (
          <section key={group.label}>
            <p className="px-3 text-xs font-semibold uppercase tracking-[.24em] text-blue-200/70">{group.label}</p>
            <div className="mt-2 space-y-1">
              {items.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-3 py-2 text-sm font-semibold transition",
                      active ? "bg-white text-black" : "text-white/72 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </nav>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: index === 0 ? "Admin" : titleize(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          {index === crumbs.length - 1 ? <span className="text-white/80">{crumb.label}</span> : <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>}
        </span>
      ))}
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { profile, user } = useAuth();
  const displayName = profile?.fullName || profile?.displayName || profile?.name || user?.email || "Admin";
  const role = profile?.role;

  return (
    <AuthGate adminOnly requireComplete={false} label="Admin access requires authentication.">
      <div className="min-h-screen bg-navy text-white lg:grid lg:grid-cols-[284px_1fr]">
        <aside className="hidden border-r border-white/10 bg-black/20 px-5 py-6 lg:block">
          <Link href="/admin" className="block rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[.28em] text-blue-200">NumSum Labs</p>
            <p className="mt-1 font-display text-2xl">Admin Workspace</p>
          </Link>
          <div className="mt-8"><AdminSidebar role={role} /></div>
          <Link href="/" className="mt-8 block rounded-2xl border border-white/10 px-3 py-2 text-sm text-white/70 hover:text-white">← Public site</Link>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Breadcrumbs />
                <p className="mt-2 text-sm text-white/65">Signed in as <span className="text-white">{displayName}</span> · <span className="uppercase">{role || "admin"}</span></p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link href="/admin/problems" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:text-white">Review problems</Link>
                <Link href="/admin/challenges/new" className="rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-blue-100">Create challenge</Link>
                <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-white/75 hover:text-white">Public site</Link>
              </div>
              <details className="lg:hidden">
                <summary className="cursor-pointer rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white">Admin menu</summary>
                <div className="mt-3 rounded-3xl border border-white/10 bg-black/30 p-4"><AdminSidebar role={role} mobile /></div>
              </details>
            </div>
          </header>
          {children}
        </div>
      </div>
    </AuthGate>
  );
}
