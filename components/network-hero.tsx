"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const nodes = [
  { label: "MSMEs", href: "/submit-problem", x: 48, y: 8 },
  { label: "Problems", href: "/problem-statements", x: 18, y: 20 },
  { label: "SOPs", href: "/sops", x: 72, y: 22 },
  { label: "Research", href: "/research", x: 34, y: 38 },
  { label: "Challenges", href: "/competitions", x: 58, y: 42 },
  { label: "Knowledge", href: "/knowledge", x: 8, y: 55 },
  { label: "Manufacturing", href: "/problem-statements?category=Manufacturing", x: 78, y: 58 },
  { label: "Pilots", href: "/pilots", x: 28, y: 72 },
  { label: "Validation", href: "/pilots", x: 54, y: 78 },
  { label: "Impact", href: "/pilots", x: 84, y: 84 },
];
const links = [[0,1],[0,2],[0,3],[1,3],[2,4],[3,4],[4,5],[4,6],[5,7],[6,8],[8,9],[2,9],[0,8]];

export function NetworkHero() {
  return <div className="relative mx-auto h-[360px] sm:h-[420px] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-glow"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,128,255,.16),transparent_62%)]" /><svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">{links.map(([from, to], index) => <motion.line key={`${from}-${to}`} x1={nodes[from].x} y1={nodes[from].y} x2={nodes[to].x} y2={nodes[to].y} stroke="rgba(125,190,255,.32)" strokeWidth="0.25" initial={{ pathLength: 0, opacity: 0.2 }} animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.18, 0.65, 0.18] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }} />)}</svg>{nodes.map((node, index) => <motion.div key={node.label} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%` }} animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }} transition={{ duration: 7 + (index % 4), repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}><motion.div whileHover={{ scale: 1.08, y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}><Link className="glass -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-blue-200/20 px-4 py-2 font-display text-xs text-white shadow-glow transition hover:border-blue-200/70 hover:text-blue-100 md:text-sm" href={node.href}>{node.label}</Link></motion.div></motion.div>)}</div>;
}
