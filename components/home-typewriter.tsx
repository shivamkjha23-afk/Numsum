"use client";
import { useEffect, useMemo, useState } from "react";
const phrases = [
  "Turning MSME Challenges into Practical Industrial Solutions",
  "From Problems to Products",
  "Problem-First Industrial Innovation",
  "MSME Upgradation through Engineering, Research, and Pilots",
  "Connecting MSME Problems with Practical Solvers",
];
export function HomeTypewriter() {
  const [index, setIndex] = useState(0); const [count, setCount] = useState(phrases[0].length); const [deleting, setDeleting] = useState(false);
  const phrase = phrases[index]; const text = useMemo(() => phrase.slice(0, count), [phrase, count]);
  useEffect(() => { const done = !deleting && count === phrase.length; const empty = deleting && count === 0; const t = window.setTimeout(() => { if (done) setDeleting(true); else if (empty) { setDeleting(false); setIndex((v) => (v + 1) % phrases.length); } else setCount((v) => v + (deleting ? -1 : 1)); }, done ? 1800 : deleting ? 35 : 65); return () => window.clearTimeout(t); }, [count, deleting, phrase.length]);
  return <span aria-live="polite">{text}<span className="animate-pulse text-blue-300">|</span></span>;
}
