"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const slides = [
  { title: "Problem intake", eyebrow: "01 · MSME", text: "Capture a real operational issue with private context protected.", stat: "48h", label: "review window" },
  { title: "Structured challenge", eyebrow: "02 · NumSum", text: "Convert symptoms into a clear scope, constraints, and success metric.", stat: "4", label: "solution paths" },
  { title: "Solver network", eyebrow: "03 · Community", text: "Invite students, researchers, experts, and startups to respond.", stat: "12+", label: "collaborators" },
  { title: "Impact record", eyebrow: "04 · Results", text: "Publish approved outcomes, case studies, and learning assets.", stat: "ROI", label: "tracked evidence" },
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const slide = slides[index];
  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 4800);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

  const move = (direction: 1 | -1) => setIndex((value) => (value + direction + slides.length) % slides.length);

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#09111d]/90 p-4 shadow-[0_32px_120px_rgba(0,0,0,.42)] md:p-5"
      aria-label="NumSum problem-to-impact showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(96,165,250,.22),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,.16),transparent_30%)]" />
      <div className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
        <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[.22em] text-white/50">
          <span>Problem to impact</span>
          <span>{String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}</span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-semibold text-amber-100/80">{slide.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] text-white md:text-4xl">{slide.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/65">{slide.text}</p>
          </div>
          <div className="rounded-3xl border border-blue-200/15 bg-blue-300/10 p-5 text-right">
            <p className="font-display text-4xl font-semibold text-blue-100">{slide.stat}</p>
            <p className="mt-1 text-xs uppercase tracking-[.18em] text-blue-100/55">{slide.label}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {slides.map((item, i) => <button key={item.title} onClick={() => setIndex(i)} className={`rounded-2xl border p-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-100/70 ${i === index ? "border-amber-100/50 bg-amber-100/10 text-white" : "border-white/10 bg-white/[0.035] text-white/55 hover:text-white"}`} aria-current={i === index}>{item.title}</button>)}
        </div>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-100 transition-all duration-500 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
        <div className="mt-5 flex justify-between">
          <button aria-label="Previous showcase slide" onClick={() => move(-1)} className="rounded-full border border-white/10 p-3 text-white/70 hover:border-white/30 hover:text-white"><ChevronLeft size={18} /></button>
          <button aria-label="Next showcase slide" onClick={() => move(1)} className="rounded-full border border-white/10 p-3 text-white/70 hover:border-white/30 hover:text-white"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
