"use client";
import { useEffect, useState } from "react";

const phrases = ["MSME Growth", "Manufacturing Excellence", "Industrial Innovation", "Energy Efficiency", "Digital Transformation", "Export Readiness", "Reliability Excellence"];
const typeMs = 70;
const eraseMs = 35;
const pauseMs = 1500;

export function HeroTypewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[index];
    const complete = !deleting && text === phrase;
    const empty = deleting && text === "";
    const timer = window.setTimeout(() => {
      if (complete) return setDeleting(true);
      if (empty) { setDeleting(false); setIndex((value) => (value + 1) % phrases.length); return; }
      setText(deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1));
    }, complete ? pauseMs : deleting ? eraseMs : typeMs);
    return () => window.clearTimeout(timer);
  }, [deleting, index, text]);

  return <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"><span className="block">Building Solutions For</span><span className="mt-3 block min-h-[1.15em] bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent" aria-live="polite">{text}<span className="ml-1 inline-block h-[.9em] w-[3px] translate-y-1 bg-blue-300 animate-pulse" /></span><span className="sr-only">MSME Growth, Manufacturing Excellence, Industrial Innovation, Energy Efficiency, Digital Transformation, Export Readiness, and Reliability Excellence</span></h1>;
}
