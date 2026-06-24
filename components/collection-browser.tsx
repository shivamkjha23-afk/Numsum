"use client";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/data-states";
import { Card } from "@/components/ui";

export interface BrowserItem { id: string; title: string; description?: string; meta?: string; tags?: string[]; href?: string; }
export function CollectionBrowser({ items, placeholder = "Search", empty = "Be among the first contributors" }: { items: BrowserItem[]; placeholder?: string; empty?: string }) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const tags = useMemo(() => Array.from(new Set(items.flatMap((item) => item.tags || []).filter(Boolean))), [items]);
  const filtered = useMemo(() => items.filter((item) => [item.title, item.description, item.meta, ...(item.tags || [])].join(" ").toLowerCase().includes(search.toLowerCase())).filter((item) => !tag || item.tags?.includes(tag)), [items, search, tag]);
  return <div className="grid gap-4 md:grid-cols-[280px_1fr]"><Card><h2 className="font-semibold">Search & Filter</h2><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" />{tags.length > 0 && <select value={tag} onChange={(e) => setTag(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3"><option value="">All tags</option>{tags.map((item) => <option key={item}>{item}</option>)}</select>}</Card><div className="grid gap-4 md:grid-cols-2">{filtered.length === 0 ? <div className="md:col-span-2"><EmptyState message={empty} /></div> : filtered.map((item) => { const body = <Card className="h-full hover:border-blue-300"><p className="text-sm text-blue-300">{item.meta}</p><h2 className="mt-2 font-display text-2xl">{item.title}</h2><p className="mt-3 text-white/60">{item.description}</p>{item.tags && <div className="mt-4 flex flex-wrap gap-2">{item.tags.map((x) => <span key={x} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">{x}</span>)}</div>}</Card>; return item.href ? <a href={item.href} key={item.id}>{body}</a> : <div key={item.id}>{body}</div>; })}</div></div>;
}
