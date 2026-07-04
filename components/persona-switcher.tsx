"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

const personas = [
  { label: "MSME", headline: "Document an operational challenge safely.", body: "Submit a private problem, complete guided onboarding, and publish only admin-approved public summaries.", href: "/submit-problem", cta: "Submit MSME Challenge" },
  { label: "Engineer", headline: "Find practical industrial problems to solve.", body: "Browse structured MSME challenges and convert constraints into implementable prototypes or process improvements.", href: "/problem-statements", cta: "Explore challenges" },
  { label: "Researcher", headline: "Map research to real MSME needs.", body: "Contribute evidence, papers, technology watch items, and SOP-ready knowledge for industrial upgradation.", href: "/research", cta: "Explore research" },
  { label: "Student", headline: "Work on real engineering contexts.", body: "Join competitions, form teams, and build project work around validated MSME problem statements.", href: "/competitions", cta: "View competitions" },
  { label: "Startup", headline: "Validate solutions before scaling.", body: "Use problem statements and pilots to test whether your product addresses practical shop-floor constraints.", href: "/pilots", cta: "Explore pilots" },
] as const;

export function PersonaSwitcher() {
  const [active, setActive] = useState(0);
  const persona = personas[active];
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm uppercase tracking-[.4em] text-amber-200/70">(Choose your path)</p>
      <h2 className="mt-3 font-display text-5xl uppercase tracking-[-.04em]">I am here as a…</h2>
      <div className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="grid gap-2" role="tablist" aria-label="Visitor role">
          {personas.map((item, index) => <button key={item.label} role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`border px-4 py-3 text-left font-semibold transition ${active === index ? "border-amber-200 bg-amber-100 text-black" : "border-white/10 bg-white/[0.04] text-white/75 hover:border-amber-200/60"}`}>{item.label}</button>)}
        </div>
        <Card className="border-amber-200/30 bg-[#11100d]">
          <p className="text-sm uppercase tracking-[.28em] text-amber-200/70">{persona.label} pathway</p>
          <h3 className="mt-4 font-display text-4xl uppercase tracking-[-.03em]">{persona.headline}</h3>
          <p className="mt-4 max-w-2xl text-white/68">{persona.body}</p>
          <div className="mt-6"><Button href={persona.href}>{persona.cta}</Button></div>
        </Card>
      </div>
    </section>
  );
}
