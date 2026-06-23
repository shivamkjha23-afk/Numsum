"use client";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (!user) {
    return <div className="flex items-center gap-2"><Link className="hidden rounded-full px-4 py-2 text-sm text-white/70 transition hover:text-white md:inline-flex" href="/sign-in">Sign In</Link><Link className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-blue-300 md:inline-flex" href="/join">Join</Link><Link className="rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-navy shadow-glow transition hover:bg-blue-300" href="/submit-challenge">Submit Problem</Link></div>;
  }

  return <div className="flex items-center gap-2"><Link className="hidden rounded-full px-4 py-2 text-sm text-white/75 transition hover:text-white md:inline-flex" href="/organizations/dashboard">Dashboard</Link><Link aria-label="Notifications" className="rounded-full border border-white/10 p-2 text-white/75 transition hover:border-blue-300 hover:text-white" href="/notifications"><Bell size={18} /></Link><div className="relative"><button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:border-blue-300" onClick={() => setOpen((value) => !value)}>{user.displayName || user.email || "Profile"}<ChevronDown size={16} /></button>{open && <div className="absolute right-0 z-50 mt-3 w-52 rounded-2xl border border-white/10 bg-[#07111f] p-2 shadow-2xl"><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/profile">My Profile</Link><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/teams">My Teams</Link><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/challenges">My Challenges</Link><Link className="block rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white" href="/settings">Settings</Link><button className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-100 hover:bg-red-500/10" onClick={() => signOut(auth)}>Logout</button></div>}</div></div>;
}
