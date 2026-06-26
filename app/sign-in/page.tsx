"use client";
import Image from "next/image";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { brand } from "@/lib/brand";
import { auth } from "@/lib/firebase";
import { ensureUserProfile, isProfileComplete } from "@/lib/repositories/firestore";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) { setError(""); try { const credential = await signInWithEmailAndPassword(auth, String(formData.get("email")), String(formData.get("password"))); const profile = await ensureUserProfile(credential.user); const returnTo = new URLSearchParams(window.location.search).get("returnTo") || "/dashboard"; router.push(isProfileComplete(profile) ? returnTo : `/profile/complete?returnTo=${encodeURIComponent(returnTo)}`); } catch (e) { setError(authErrorMessage(e)); } }
  async function google() { setError(""); try { const credential = await signInWithPopup(auth, new GoogleAuthProvider()); const profile = await ensureUserProfile(credential.user); const returnTo = new URLSearchParams(window.location.search).get("returnTo") || "/dashboard"; router.push(isProfileComplete(profile) ? returnTo : `/profile/complete?returnTo=${encodeURIComponent(returnTo)}`); } catch (e) { setError(authErrorMessage(e)); } }
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#17336d,transparent_45%),#02050a] px-6 py-12"><div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_420px]"><section><Image src={brand.logo} alt="NumSum Labs logo" width={120} height={120} className="rounded-3xl bg-white p-3 shadow-glow" priority /><p className="mt-8 text-sm uppercase tracking-[.35em] text-blue-200">{brand.tagline}</p><h1 className="mt-4 font-display text-5xl font-bold text-white md:text-7xl">Welcome to NumSum Labs</h1><p className="mt-5 max-w-2xl text-lg text-white/70">Access your innovation workspace for problem statements, research, competitions, teams, and governed collaboration.</p></section><Card className="border-white/15 bg-white/10 shadow-2xl"><div className="flex items-center gap-3"><Image src={brand.logo} alt="NumSum Labs" width={44} height={44} className="rounded-xl bg-white p-1" /><div><h2 className="font-display text-3xl">Sign In</h2><p className="text-sm text-white/60">Public browsing stays open; protected workflows require an account.</p></div></div><form action={submit} className="mt-6 grid gap-3"><input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="password" type="password" placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Sign In</button></form><button className="mt-3 w-full rounded-full border border-white/10 px-5 py-3 text-white" onClick={google}>Continue with Google</button>{error && <p className="mt-4 text-sm text-red-100">{error}</p>}</Card></div></main>;
}
