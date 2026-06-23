"use client";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/data-states";
import { Card } from "@/components/ui";
import type { Organization } from "@/lib/types";

export function OrganizationBrowser({ organizations }: { organizations: Organization[] }) {
  const [search, setSearch] = useState(""); const [industry, setIndustry] = useState(""); const [city, setCity] = useState("");
  const industries = useMemo(() => Array.from(new Set(organizations.map((o) => o.industry).filter(Boolean))), [organizations]);
  const cities = useMemo(() => Array.from(new Set(organizations.map((o) => o.city).filter(Boolean))), [organizations]);
  const filtered = organizations.filter((o) => [o.name, o.description, o.industry, o.city].join(" ").toLowerCase().includes(search.toLowerCase())).filter((o) => !industry || o.industry === industry).filter((o) => !city || o.city === city);
  return <div className="grid gap-4 md:grid-cols-[280px_1fr]"><Card><h2 className="font-semibold">Directory filters</h2><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organizations" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /><select value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3"><option value="">All industries</option>{industries.map((item) => <option key={item}>{item}</option>)}</select><select value={city} onChange={(e) => setCity(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3"><option value="">All locations</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></Card>{filtered.length === 0 ? <EmptyState message="Be among the first contributors" /> : <div className="grid gap-4 md:grid-cols-2">{filtered.map((organization) => <Card key={organization.id}><p className="text-blue-300">{[organization.industry, organization.city, organization.status].filter(Boolean).join(" · ") || "Organization"}</p><h2 className="mt-2 font-display text-2xl">{organization.name}</h2><p className="mt-3 text-white/60">{organization.description || "This organization has not published a description yet."}</p>{organization.website && <a className="mt-4 block text-sm text-blue-300 underline" href={organization.website}>Website</a>}</Card>)}</div>}</div>;
}
