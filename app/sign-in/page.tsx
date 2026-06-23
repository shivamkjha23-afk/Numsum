"use client";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { auth } from "@/lib/firebase";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    try { await signInWithEmailAndPassword(auth, String(formData.get("email")), String(formData.get("password"))); router.push("/organizations/dashboard"); } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
  }
  async function google() {
    setError("");
    try { await signInWithPopup(auth, new GoogleAuthProvider()); router.push("/organizations/dashboard"); } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in with Google."); }
  }
  return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-lg"><h1 className="font-display text-4xl">Sign In</h1><p className="mt-3 text-white/60">Browsing remains public. Sign in only for protected workflows.</p><form action={submit} className="mt-6 grid gap-3"><input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="password" type="password" placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Sign In</button></form><button className="mt-3 w-full rounded-full border border-white/10 px-5 py-3 text-white" onClick={google}>Continue with Google</button>{error && <p className="mt-4 text-sm text-red-100">{error}</p>}</Card></main>;
}
