"use client";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { auth } from "@/lib/firebase";
import { navLinks } from "@/lib/navigation";

function ProfileMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  return <div className="relative"><button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:border-blue-300" onClick={() => setOpen((value) => !value)}>{user.displayName || user.email || "Profile"}<ChevronDown size={16} /></button>{open && <div className="absolute right-0 z-50 mt-3 w-52 rounded-2xl border border-white/10 bg-[#07111f] p-2 shadow-2xl"><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/profile">My Profile</Link><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/challenges">My Challenges</Link><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/teams">My Teams</Link><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/settings">Settings</Link><button className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-100 hover:bg-red-500/10" onClick={() => signOut(auth)}>Logout</button></div>}</div>;
}

export function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  const actions = user ? <><Link className="hidden rounded-full px-4 py-2 text-sm text-white/75 transition hover:text-white md:inline-flex" href="/dashboard">Dashboard</Link><Link aria-label="Notifications" className="rounded-full border border-white/10 p-2 text-white/75 transition hover:border-blue-300 hover:text-white" href="/notifications"><Bell size={18} /></Link><ProfileMenu user={user} /></> : <><button className="hidden rounded-full px-4 py-2 text-sm text-white/70 transition hover:text-white md:inline-flex" onClick={() => setModal(true)}>Sign In</button><Link className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-blue-300 md:inline-flex" href="/join">Join</Link><Link className="rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-navy shadow-glow transition hover:bg-blue-300" href="/submit-challenge">Submit Problem</Link></>;
  return <><div className="flex items-center gap-2">{actions}<button aria-label="Open menu" className="rounded-full border border-white/10 p-2 lg:hidden" onClick={() => setMenu(true)}><Menu size={18} /></button></div>{menu && <div className="fixed inset-0 z-[90] bg-[#02050a]/95 p-6 backdrop-blur-xl lg:hidden"><div className="flex items-center justify-between"><Link className="font-display text-2xl font-bold" href="/" onClick={() => setMenu(false)}>NumSum</Link><button aria-label="Close menu" onClick={() => setMenu(false)}><X /></button></div><div className="mt-8 grid gap-3">{navLinks.map(([label, href]) => <Link className="rounded-2xl border border-white/10 px-4 py-3 text-white/80" href={href} key={href} onClick={() => setMenu(false)}>{label}</Link>)}</div><div className="mt-6 flex flex-wrap gap-3">{user ? <><Link href="/dashboard" className="rounded-full bg-blue-400 px-4 py-2 text-navy">Dashboard</Link><ProfileMenu user={user} /></> : <><button className="rounded-full border border-white/10 px-4 py-2" onClick={() => setModal(true)}>Sign In</button><Link className="rounded-full border border-white/10 px-4 py-2" href="/join">Join</Link><Link className="rounded-full bg-blue-400 px-4 py-2 text-navy" href="/submit-challenge">Submit Problem</Link></>}</div></div>}<AuthModal open={modal} onClose={() => setModal(false)} /></>;
}
