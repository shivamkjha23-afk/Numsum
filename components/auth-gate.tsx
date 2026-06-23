"use client";
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { LoadingState } from "@/components/data-states";
import { auth } from "@/lib/firebase";

export function AuthGate({ children, label = "Sign in to continue" }: { children: ReactNode; label?: string }) {
  const [state, setState] = useState<"loading" | "authed" | "guest">("loading");
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (user) => setState(user ? "authed" : "guest")), []);

  async function signIn(formData: FormData) {
    setError("");
    try { await signInWithEmailAndPassword(auth, String(formData.get("email")), String(formData.get("password"))); } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
  }

  async function googleSignIn() {
    setError("");
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in with Google."); }
  }

  if (state === "loading") return <LoadingState label="Checking authentication" />;
  if (state === "authed") return <>{children}</>;

  return <div className="relative min-h-[60vh]"><div className="pointer-events-none opacity-25 blur-[1px]">{children}</div><div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title"><div className="glass w-full max-w-md rounded-3xl border border-white/15 p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[.3em] text-blue-300">Protected action</p><h2 id="auth-modal-title" className="mt-3 font-display text-3xl">{label}</h2><p className="mt-3 text-sm text-white/60">Browsing remains public. Sign in here to continue without losing your place.</p></div><button aria-label="Close sign in prompt" className="rounded-full border border-white/10 p-2 text-white/70" onClick={() => history.back()}><X size={18} /></button></div><form action={signIn} className="mt-6 grid gap-3"><input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="password" type="password" placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Sign In</button></form><button className="mt-3 w-full rounded-full border border-white/10 px-5 py-3 text-white" onClick={googleSignIn}>Continue with Google</button><a className="mt-4 block text-center text-sm text-blue-200 underline decoration-blue-200/30" href="/join">Create an account</a>{error && <p className="mt-4 text-sm text-red-100">{error}</p>}</div></div></div>;
}
